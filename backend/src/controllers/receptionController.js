const prisma = require('../config/db');

exports.getPendingAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { status: 'Pending Approval' },
      include: { patient: true, doctor: true }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id: parseInt(id) }, include: { patient: true } });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    // Generate Token Number (e.g. P-021)
    const tokenNumber = `P-${Math.floor(100 + Math.random() * 900)}`;
    const qrCodeValue = `${tokenNumber}-${appointment.patient.name.replace(/\s+/g, '')}`;

    await prisma.$transaction([
      prisma.appointment.update({
        where: { id: parseInt(id) },
        data: { status: 'Token Assigned' }
      }),
      prisma.patient.update({
        where: { id: appointment.patientId },
        data: { tokenNumber, qrCode: qrCodeValue, status: 'Token Assigned' }
      }),
      prisma.notification.create({
        data: {
          patientId: appointment.patientId,
          title: 'Appointment Approved',
          message: `Your appointment is approved. Your token is ${tokenNumber}.`
        }
      })
    ]);

    res.json({ message: 'Appointment approved and token assigned', tokenNumber, qrCode: qrCodeValue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
