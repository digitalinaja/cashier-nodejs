// utils/responseProcessor.js

function processTidbApiResponse(response) {
    if (response && response.data && response.data.data && response.data.data.rows) {
      return response.data.data.rows;
    }
    throw new Error('Invalid TiDB API response format');
  }
  
  module.exports = processTidbApiResponse;
  