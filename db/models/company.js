const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
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
  bank_name: {
    type: String
  },
  tax_number: {
    type: String
  },
  start_invoice_number: {
    type: String
  },
  invoice_item_code: {
    type: Number
  },
  logo: {
    type: String
  }
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;