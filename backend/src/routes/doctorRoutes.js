const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/:doctorId/patients', requireAuth, requireRole(['DOCTOR']), doctorController.getPatients);
router.post('/prescriptions', requireAuth, requireRole(['DOCTOR']), doctorController.createPrescription);
router.post('/lab-requests', requireAuth, requireRole(['DOCTOR']), doctorController.createLabRequest);

module.exports = router;
