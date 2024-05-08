const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  client_name: {
    type: String
  },
  email: {
    type: String
  },
  phone_number: {
    type: String
  },
  address: {
    type: String
  },
  bank_account: {
    type: String
  },
  tax_number: {
    type: String
  }
});

const Client = mongoose.model('Client', ClientSchema);
module.exports = Client;