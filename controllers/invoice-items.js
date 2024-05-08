const InvoiceItem = require('../db/models/inovice-item');

const { statusCodes } = require('../helpers/statusCodes');
const { errorMessages } = require('../helpers/errorMessages');
const { generateInvoiceItem } = require('../helpers/generateModels');

const { ErrorKind } = require('../enums/errorKind');

exports.getAll = async (req, res) => {

  let skip = 0;
  if(parseInt(req.query.page) === 1) {
    skip = 0;
  } else {
    skip = (parseInt(req.query.take) * parseInt(req.query.page)) - parseInt(req.query.take);
  }

  const filters = {};

  try {
    const invoiceItems = await InvoiceItem.find(filters).sort({ _id: 'desc' })
      .skip(skip).limit(parseInt(req.query.take));
    const invoiceItemsCount = await InvoiceItem.find().count();

    res.status(statusCodes.success).json({
      page: parseInt(req.query.page),
      total: invoiceItemsCount,
      list: invoiceItems.map(invoiceItem => generateInvoiceItem(invoiceItem))
    });
  } catch (error) {
    res.status(statusCodes.server_error).json({
      message: errorMessages.internal,
      error
    });
  }
}

exports.getSingle = async (req, res) => {

  const id = req.params.id;

  if (id) {
    try {
      const invoiceItem = await InvoiceItem.findById(id);
      if (invoiceItem) {
        res.status(statusCodes.success).send(generateInvoiceItem(invoiceItem));
      } else {
        res.status(statusCodes.user_error).json({
          message: errorMessages.not_exist('Invoice item', id)
        });
      }
    } catch (error) {
      if(error.kind === ErrorKind.ID) {
        res.status(statusCodes.user_error).json({
          message: errorMessages.invalid_id(id)
        });
      } else {
        res.status(statusCodes.server_error).json({
          message: errorMessages.internal,
          error
        });
      }
    }
  } else {
    res.status(statusCodes.user_error).json({
      message: errorMessages.id_missing
    });
  }
}

exports.addNew = async (req, res) => {
  const data = { ...req.body };

  try {
    const lastInvoiceItem = await InvoiceItem.find().sort([['_id', -1]]).limit(1);
    let newCode;
    if (lastInvoiceItem[0]) {
      if (lastInvoiceItem[0].code) {
        newCode = parseInt(lastInvoiceItem[0].code) + 1;
      } else {
        newCode = 1;
      }
    } else {
      newCode = 1;
    }
    
    const newInvoiceItemData = { 
      code: newCode.toString(),
      name: data.name,
      quantity: 0,
      price: data.price,
      total: 0
    };

    await InvoiceItem.insertMany(newInvoiceItemData);
    const newInvoiceItem = await InvoiceItem.find({ code: newCode.toString() });
    res.status(statusCodes.success).json({
      message: 'Invoice item has been added successfully.',
      invoiceItem: generateInvoiceItem(newInvoiceItem[0])
    });
  } catch (error) {
    console.log(error);
    if(error.kind === ErrorKind.ID) {
      res.status(statusCodes.user_error).json({
        message: errorMessages.invalid_id(id)
      });
    } else {
      res.status(statusCodes.server_error).json({
        message: errorMessages.internal,
        error
      });
    }
  }
}

exports.update = async (req, res) => {

  const id = req.params.id;

  if (id) {
    try {
      const invoiceItem = await InvoiceItem.findById(id);
      if (invoiceItem) {
        const data = { ...req.body };

        await InvoiceItem.updateOne({ _id: id }, data);
        const updatedInvoiceItem = await InvoiceItem.findById(id);

        res.status(statusCodes.success).json({
          message: 'Invoice item has been updated.',
          invoiceItem: generateInvoiceItem(updatedInvoiceItem)
        });
      } else {
        res.status(statusCodes.user_error).json({
          message: errorMessages.not_exist('Invoice item', id)
        });
      }
    } catch (error) {
      if(error.kind === ErrorKind.ID) {
        res.status(statusCodes.user_error).json({
          message: errorMessages.invalid_id(id)
        });
      } else {
        res.status(statusCodes.server_error).json({
          message: errorMessages.internal,
          error
        });
      }
    }
  } else {
    res.status(statusCodes.user_error).json({
      message: errorMessages.id_missing
    });
  }
}

exports.delete = async (req, res) => {

  const id = req.params.id;

  if (id) {
    try {
      const invoiceItem = await InvoiceItem.findById(id);
      if (invoiceItem) {
        await InvoiceItem.deleteOne({ _id: id });
        res.status(statusCodes.success).json({
          message: `Invoice item with ID: [${ id }] has been deleted.`
        });
      } else {
        res.status(statusCodes.user_error).json({
          message: `Invoice item with ID: [${ id }] does not exist.`
        });
      }
    } catch (error) {
      if(error.kind === ErrorKind.ID) {
        res.status(statusCodes.user_error).json({
          message: errorMessages.invalid_id(_id)
        });
      } else {
        res.status(statusCodes.server_error).json({
          message: errorMessages.internal,
          error: error
        });
      }
    }
  } else {
    res.status(statusCodes.user_error).json({
      message: errorMessages.id_missing
    });
  }
}