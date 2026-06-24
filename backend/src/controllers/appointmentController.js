const prisma = require('../config/db');

exports.bookAppointment = async (req, res) => {
  const { doctorId, appointmentDate, slotTime, symptoms } = req.body;
  try {
    // Note: req.user.id is the User ID. We need the Patient ID.
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    if (!patient) return res.status(404).json({ error: 'Patient profile not found' });

    if (symptoms) {
      await prisma.patient.update({
        where: { id: patient.id },
        data: { symptoms }
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: parseInt(doctorId),
        appointmentDate: new Date(appointmentDate),
        slotTime,
        status: 'Pending Approval'
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientHistory = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    if (!patient) return res.status(404).json({ error: 'Patient profile not found' });

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: { doctor: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({ 
      where: { userId: req.user.id },
      include: {
        appointments: { include: { doctor: true }, orderBy: { appointmentDate: 'asc' }, take: 1 },
        prescriptions: { orderBy: { createdAt: 'desc' }, take: 1 },
        labRequests: { orderBy: { createdAt: 'desc' }, take: 1 },
        notifications: { where: { isRead: false } }
      }
    });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
