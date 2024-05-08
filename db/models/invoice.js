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
  total: {
    type: Number
  }
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);
module.exports = Invoice;