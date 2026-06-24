const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.post('/', requireAuth, requireRole(['PATIENT']), appointmentController.bookAppointment);
router.get('/history', requireAuth, requireRole(['PATIENT']), appointmentController.getPatientHistory);
router.get('/dashboard', requireAuth, requireRole(['PATIENT']), appointmentController.getDashboardData);

module.exports = router;
