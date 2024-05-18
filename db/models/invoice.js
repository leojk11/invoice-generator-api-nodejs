const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  client: {
    type: Object
  },
  issue_date: {
    type: String
  },
  due_date: {
    type: String
  },
  items: {
    type: Array
  },
  invoice_number: {
    type: String
  },
  price: {
    type: Number
  },
  tax: {
    type: Number
  },
  total_price: {
    type: Number
  },
  currency: {
    type: String
  }
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);
module.exports = Invoice;