const Invoice = require('../db/models/invoice');

const { statusCodes } = require('../helpers/statusCodes');
const { errorMessages } = require('../helpers/errorMessages');
const { generateInvoice } = require('../helpers/generateModels');

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
    const invoices = await Invoice.find(filters).sort({ _id: 'desc' })
      .skip(skip).limit(parseInt(req.query.take));
    const invoiceCount = await Invoice.find().count();

    res.status(statusCodes.success).json({
      page: parseInt(req.query.page),
      total: invoiceCount,
      list: invoices.map(invoice => generateInvoice(invoice))
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
      const invoice = await Invoice.findById(id);
      if (invoice) {
        res.status(statusCodes.success).send(generateInvoice(invoice));
      } else {
        res.status(statusCodes.user_error).json({
          message: errorMessages.not_exist('Invoice', id)
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
    await Invoice.insertMany(data);
    const newInvoice = await Invoice.find({ 'client.client_name': data.client.client_name });
    res.status(statusCodes.success).json({
      message: 'Invoice has been added successfully.',
      invoice: generateInvoice(newInvoice[0])
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
      const invoice = await Invoice.findById(id);
      if (invoice) {
        const data = { ...req.body };

        await Invoice.updateOne({ _id: id }, data);
        const updatedInvoice = await Invoice.findById(id);

        res.status(statusCodes.success).json({
          message: 'Invoice has been updated.',
          invoice: generateInvoice(updatedInvoice)
        });
      } else {
        res.status(statusCodes.user_error).json({
          message: errorMessages.not_exist('Invoice', id)
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
      const invoice = await Invoice.findById(id);
      if (invoice) {
        await Invoice.deleteOne({ _id: id });
        res.status(statusCodes.success).json({
          message: `Invoice with ID: [${ id }] has been deleted.`
        });
      } else {
        res.status(statusCodes.user_error).json({
          message: `Invoice with ID: [${ id }] does not exist.`
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