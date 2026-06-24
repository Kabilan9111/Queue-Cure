const prisma = require('../config/db');

exports.getPatients = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const doc = await prisma.doctor.findUnique({ where: { userId: parseInt(doctorId) } });
    if (!doc) return res.status(404).json({ error: 'Doctor not found' });

    // Fetch appointments for this doctor that are assigned tokens
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doc.id, status: 'Token Assigned' },
      include: { patient: true }
    });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPrescription = async (req, res) => {
  const { patientId, doctorId, medicines, notes } = req.body;
  try {
    const prescription = await prisma.prescription.create({
      data: {
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        medicines, // expected to be sent as JSON array
        notes
      }
    });
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLabRequest = async (req, res) => {
  const { patientId, doctorId, tests, notes } = req.body;
  try {
    const labRequest = await prisma.labRequest.create({
      data: {
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        tests, // expected to be sent as JSON array
        notes
      }
    });
    res.status(201).json(labRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
