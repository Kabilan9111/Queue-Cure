const express = require('express');
const router = express.Router();
const receptionController = require('../controllers/receptionController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/pending', requireAuth, requireRole(['RECEPTION']), receptionController.getPendingAppointments);
router.patch('/approve/:id', requireAuth, requireRole(['RECEPTION']), receptionController.approveAppointment);

module.exports = router;
