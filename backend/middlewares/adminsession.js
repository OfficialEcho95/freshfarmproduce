const Admin = require('../admin/models/admin');

const getAdminNameFromSession = async (req) => {
  if (!req.session || !req.session.adminId) {
    throw new Error('No admin session found.');
  }

  try {
    const adminId = req.session.adminId.toString();

    console.log(adminId);
    const admin = await Admin.findById(adminId);

    if (!admin) {
      throw new Error(`Admin not found with ID: ${adminId}`);
    }
    return admin.name;
  } catch (error) {
    console.error('Error retrieving admin name from session:', error);
    throw error;
  }
};

module.exports = getAdminNameFromSession;
