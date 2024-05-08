const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  code: {
    type: String
  },
  name: {
    type: String
  },
  quantity: {
    type: Number
  },
  price: {
    type: Number
  },
  total: {
    type: Number
  }
});

const InvoiceItem = mongoose.model('InvoiceItem', InvoiceItemSchema);
module.exports = InvoiceItem;