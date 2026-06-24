const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/orders', requireAuth, requireRole(['PHARMACY']), pharmacyController.getOrders);
router.patch('/orders/:id', requireAuth, requireRole(['PHARMACY']), pharmacyController.updateOrderStatus);

module.exports = router;
