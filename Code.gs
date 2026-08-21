// ==========================================
// KONFIGURASI UTAMA
// ==========================================
const API_KEY = "KEPPIN_STORE_SECRET_2026"; // Sesuikan dengan script.js di website kamu
const EMAIL_PENERIMA = "Roffiekanahaya@gmail.com"; // Email penerima notifikasi
const SHEET_NAME = 'Orders';

// ==========================================
// 1. HANDLER PENERIMAAN DATA (POST REQUEST)
// ==========================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Validasi API Key
    if (!isAuthorized(data.apiKey)) {
      return jsonResponse({ status: 'error', message: 'API Key tidak valid!' });
    }

    const action = data.action || 'createOrder';

    // Rute Tindakan
    if (action === 'createOrder') {
      return handleCreateOrder(data);
    } else if (action === 'updateStatus') {
      return handleUpdateStatus(data);
    } else {
      return jsonResponse({ status: 'error', message: 'Aksi POST tidak valid.' });
    }

  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

// ==========================================
// 2. HANDLER PENGAMBILAN DATA (GET REQUEST)
// ==========================================
function doGet(e) {
  try {
    const apiKey = e.parameter.apiKey;
    const action = e.parameter.action;

    if (!isAuthorized(apiKey)) {
      return jsonResponse({ status: 'error', message: 'API Key tidak valid!' });
    }

    if (action === 'checkStatus') {
      return handleCheckStatus(e.parameter.orderId);
    } else if (action === 'getOrders') {
      return handleGetOrders();
    } else {
      return jsonResponse({ status: 'error', message: 'Aksi GET tidak valid.' });
    }

  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

// ==========================================
// 3. FUNGSI LOGIKA BISNIS & SPREADSHEET
// ==========================================
function handleCreateOrder(data) {
  const sheet = getOrCreateSheet(SHEET_NAME);
  const timestamp = new Date();

  sheet.appendRow([
    timestamp,
    data.orderId || '',
    data.game || '',
    data.userId || '',
    data.zoneId || '-',
    data.item || '',
    data.payment || '',
    data.uniqueCode || 0,
    data.price || 0,
    data.status || 'PENDING'
  ]);

  sendEmailNotification(data);

  return jsonResponse({
    status: 'success',
    message: 'Pesanan berhasil dibuat dan notifikasi dikirim.',
    orderId: data.orderId
  });
}

function handleUpdateStatus(data) {
  const sheet = getOrCreateSheet(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][1]) === String(data.orderId)) {
      sheet.getRange(i + 1, 10).setValue(data.newStatus);
      return jsonResponse({
        status: 'success',
        message: `Status pesanan ${data.orderId} berhasil diperbarui menjadi ${data.newStatus}.`
      });
    }
  }

  return jsonResponse({ status: 'error', message: 'ID Pesanan tidak ditemukan.' });
}

function handleCheckStatus(orderId) {
  const sheet = getOrCreateSheet(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]) === String(orderId)) {
      return jsonResponse({
        status: 'success',
        orderId: data[i][1],
        orderStatus: data[i][9]
      });
    }
  }

  return jsonResponse({ status: 'error', message: 'ID Pesanan tidak ditemukan.' });
}

function handleGetOrders() {
  const sheet = getOrCreateSheet(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0] || [];
  const orders = [];

  for (let i = 1; i < data.length; i++) {
    let order = {};
    for (let j = 0; j < headers.length; j++) {
      order[headers[j]] = data[i][j];
    }
    orders.push(order);
  }

  return jsonResponse({ status: 'success', data: orders.reverse() });
}

// ==========================================
// 4. NOTIFIKASI EMAIL & HELPER
// ==========================================
function sendEmailNotification(order) {
  if (!EMAIL_PENERIMA) return;

  const subjek = `[PESANAN BARU] ${order.game || '-'} - ${order.orderId || '-'}`;
  const pesanTeks = 
    `Halo Admin,\n\n` +
    `Ada pesanan baru masuk ke Keppin Game Store:\n\n` +
    `• ID Pesanan  : ${order.orderId || '-'}\n` +
    `• Game        : ${order.game || '-'}\n` +
    `• User ID     : ${order.userId || '-'}\n` +
    `• Zone ID     : ${order.zoneId || '-'}\n` +
    `• Item        : ${order.item || '-'}\n` +
    `• Pembayaran  : ${order.payment || '-'}\n` +
    `• Kode Unik   : ${order.uniqueCode || 0}\n` +
    `• Total Bayar : Rp ${Number(order.price || 0).toLocaleString('id-ID')}\n` +
    `• Status      : ${order.status || 'PENDING'}\n\n` +
    `Silakan cek Google Sheets Anda untuk memproses transaksi.`;

  try {
    MailApp.sendEmail({
      to: EMAIL_PENERIMA,
      subject: subjek,
      body: pesanTeks
    });
  } catch (err) {
    console.error("Gagal mengirim email: " + err.toString());
  }
}

function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Order ID', 'Game', 'User ID', 
      'Zone ID', 'Item', 'Payment', 'Unique Code', 
      'Price', 'Status'
    ]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function isAuthorized(key) {
  return key && key === API_KEY;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// 5. FUNGSI PENGUJIAN (TESTING)
// ==========================================
function testKirimEmail() {
  const testOrder = {
    orderId: 'TEST-123456',
    game: 'Mobile Legends',
    userId: '12345678',
    zoneId: '1234',
    item: '86 Diamonds',
    payment: 'QRIS',
    uniqueCode: 123,
    price: 20123,
    status: 'PENDING'
  };

  sendEmailNotification(testOrder);
}

function testBuatPesanan() {
  const testData = {
    apiKey: API_KEY,
    action: 'createOrder',
    orderId: 'TEST-' + Math.floor(Math.random() * 899999 + 100000),
    game: 'Mobile Legends',
    userId: '12345678',
    zoneId: '1234',
    item: '86 Diamonds',
    payment: 'QRIS',
    uniqueCode: 123,
    price: 20123,
    status: 'PENDING'
  };
  
  handleCreateOrder(testData);
}