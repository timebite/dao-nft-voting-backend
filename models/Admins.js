const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date_added: {
    type: Date,
    default: Date.now
  }
});

const Admins = mongoose.model('Admins', AdminSchema);
module.exports = Admins;