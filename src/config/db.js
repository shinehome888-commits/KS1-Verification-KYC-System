const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected – KS1 KYC System');
};

module.exports = connectDB(); // Export promise
