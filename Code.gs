const SHEET_NAME = 'Orders';
const API_KEY = 'seicut';

function doGet(event) {
  if (!isAuthorized(event.parameter.key)) {
    return jsonResponse({ ok: false, error: 'Unauthorized' });
  }

  const sheet = getOrdersSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values.shift() || [];
  const orders = values.map(row => {
    const order = {};
    headers.forEach((header, index) => order[header] = row[index]);
    return order;
  });

  return jsonResponse({ ok: true, orders: orders.reverse() });
}

function doPost(event) {
  const body = JSON.parse(event.postData.contents || '{}');
  if (body.key !== API_KEY) {
    return jsonResponse({ ok: false, error: 'Unauthorized' });
  }

  const sheet = getOrdersSheet();
  sheet.appendRow([
    new Date(),
    body.game || '',
    body.userId || '',
    body.zoneId || '',
    body.item || '',
    body.payment || '',
    body.price || 0,
    body.status || 'Menunggu Konfirmasi',
    body.date || '',
    body.email || ''
  ]);

  sendEmailNotification(body);

  return jsonResponse({ ok: true });
}

function sendEmailNotification(order) {
  const email = PropertiesService.getScriptProperties().getProperty('NOTIFICATION_EMAIL') || '';
  if (!email) return;

  const message = [
    'Pesanan baru masuk di Keppin Game Store',
    '',
    `Game: ${order.game || '-'}`,
    `User ID: ${order.userId || '-'}`,
    `Zona ID: ${order.zoneId || '-'}`,
    `Item: ${order.item || '-'}`,
    `Metode: ${order.payment || '-'}`,
    `Total: Rp ${Number(order.price || 0).toLocaleString('id-ID')}`,
    `Status: ${order.status || 'Menunggu Konfirmasi'}`
  ].join('\n');

  MailApp.sendEmail({
    to: email,
    subject: `Pesanan baru - ${order.game || 'Keppin Game Store'}`,
    body: message
  });
}

function testEmailNotification() {
  sendEmailNotification({
    game: 'Tes Keppin Store',
    userId: '12345678',
    zoneId: '1234',
    item: 'Tes pembayaran',
    payment: 'QRIS',
    price: 1000,
    status: 'Tes notifikasi',
    date: new Date().toLocaleString('id-ID')
  });
}

function getOrdersSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['createdAt', 'game', 'userId', 'zoneId', 'item', 'payment', 'price', 'status', 'date', 'email']);
    sheet.setFrozenRows(1);
  } else {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (!headers.includes('email')) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue('email');
    }
  }
  return sheet;
}

function isAuthorized(key) {
  return key && key === API_KEY && API_KEY !== 'GANTI_DENGAN_KODE_RAHASIA';
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
