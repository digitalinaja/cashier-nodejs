const tidbAPI = require('../config/tidb');
const processTidbApiResponse = require('../utils/responseProcessor');

class Sale {
  static async create(data) {
    const response = await tidbAPI.post('/sales', data);
    return response.data;
  }

  static async addItem(data) {
    const response = await tidbAPI.post('/items', data);
    return response.data;
  }

  static async salesitemsPost(data) {
    const response = await tidbAPI.post('/sales_items/batch', data);
    return response.data;
  }

  static async itemgetAll() {
    const response = await tidbAPI.get('/items/all');
    return processTidbApiResponse(response);
  }

  static async itemgetAllAvailable() {
    const response = await tidbAPI.get('/items/all_available');
    return processTidbApiResponse(response);
  }

  static async itemUpdate(data) {
    const response = await tidbAPI.put('/items', data);
    return response.data;
  }

  static async getAll() {
    const response = await tidbAPI.get('/sales/all');
    return processTidbApiResponse(response);
  }

  static async getTodaySalesProduk() {
    const response = await tidbAPI.get('/sales/today/produk');
    return processTidbApiResponse(response);
  }

  static async generateDailyReport(date) {
    const response = await tidbAPI.get(`/sales/date?date=${date}`);
    return processTidbApiResponse(response);
  }
}

module.exports = Sale;
