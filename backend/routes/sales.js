const express = require('express');
const router = express.Router();
const Sale = require('../models/sale');

router.post('/sales', async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Error creating sale' });
  }
});

router.post('/sales-items-post', async (req, res) => {
    try {
      const sale = await Sale.salesitemsPost(req.body);
      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Error creating sale' });
    }
  });

  //add new produk/items
  router.post('/add-produk', async (req, res) => {
    try {
      const additem = await Sale.addItem(req.body);
      res.status(200).json({ success: true, data: additem });
    } catch (error) {
      console.error('Error in /items/all GET route:', error);
      res.status(500).json({ success: false, error: 'Error adding new items' });
    }
  });

  //update availablity produk
  router.post('/update-produk', async (req, res) => {
    try {
      const updateItem = await Sale.itemUpdate(req.body);
      res.status(200).json({ success: true, data: updateItem });
    } catch (error) {
      console.error('Error in /items/all GET route:', error);
      res.status(500).json({ success: false, error: 'Error updating items' });
    }
  });

// Get all item/produk
router.get('/items/all', async (req, res) => {
    try {
      const sales = await Sale.itemgetAll();
      res.status(200).json({ success: true, data: sales });
    } catch (error) {
      console.error('Error in /items/all GET route:', error);
      res.status(500).json({ success: false, error: 'Error fetching items' });
    }
  });

  //get all available produk
  router.get('/items/all_available', async (req, res) => {
    try {
      const item = await Sale.itemgetAllAvailable();
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      console.error('Error in /items/all GET route:', error);
      res.status(500).json({ success: false, error: 'Error fetching items' });
    }
  });

// Get all sales
router.get('/sales', async (req, res) => {
    try {
      const sales = await Sale.getAll();
      res.status(200).json({ success: true, data: sales });
    } catch (error) {
      console.error('Error in /sales GET route:', error);
      res.status(500).json({ success: false, error: 'Error fetching sales' });
    }
  });

  router.get('/sales-today-produk', async (req, res) => {
    try {
      const sales = await Sale.getTodaySalesProduk();
      res.status(200).json({ success: true, data: sales });
    } catch (error) {
      console.error('Error in /sales GET route:', error);
      res.status(500).json({ success: false, error: 'Error fetching sales' });
    }
  });

router.get('/sales/report', async (req, res) => {
  try {
    const date = req.query.date;
    const report = await Sale.generateDailyReport(date);
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Error generating report' });
  }
});

// Example route
router.get('/', (req, res) => {
    res.send('Sales endpoint');
  });

module.exports = router;
