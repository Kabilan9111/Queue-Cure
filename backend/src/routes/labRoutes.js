const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/', requireAuth, requireRole(['LAB']), labController.getRequests);
router.patch('/:id', requireAuth, requireRole(['LAB']), labController.updateRequestStatus);

module.exports = router;
