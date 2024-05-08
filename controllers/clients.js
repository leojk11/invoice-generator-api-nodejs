const Client = require('../db/models/client');

const { statusCodes } = require('../helpers/statusCodes');
const { errorMessages } = require('../helpers/errorMessages');
const { generateClient } = require('../helpers/generateModels');

const { ErrorKind } = require('../enums/errorKind');

exports.getAll = async (req, res) => {

  let skip = 0;
  if(parseInt(req.query.page) === 1) {
    skip = 0;
  } else {
    skip = (parseInt(req.query.take) * parseInt(req.query.page)) - parseInt(req.query.take);
  }

  const filters = {};

  if (req.query.name) {
    filters.client_name = { $regex: req.query.name, $options: 'i' };
  }

  console.log(filters);

  try {
    const clients = await Client.find(filters).sort({ _id: 'desc' })
      .skip(skip).limit(parseInt(req.query.take));
    const clientsCount = await Client.find().count();

    // await Logger.insertMany(generateSuccessLogger(loggedInUser, req));

    res.status(statusCodes.success).json({
      page: parseInt(req.query.page),
      total: clientsCount,
      list: clients.map(client => generateClient(client))
    });
  } catch (error) {
    // await Logger.insertMany(generateErrorLogger(loggedInUser, req, error));

    res.status(statusCodes.server_error).json({
      message: errorMessages.internal_tr,
      actual_message: errorMessages.internal,
      error
    });
  }
}

exports.getSingle = async (req, res) => {

  const id = req.params.id;

  if (id) {
    try {
      const client = await Client.findById(id);
      if (client) {
        // await Logger.insertMany(generateSuccessLogger(loggedInUser, req));
        res.status(statusCodes.success).send(generateClient(client));
      } else {
        // await Logger.insertMany(generateErrorLogger(loggedInUser, req, errorMessages.not_exist('Album', id)));
  
        res.status(statusCodes.user_error).json({
          message: errorMessages.client_not_exist,
          actual_message: errorMessages.not_exist('Album', id)
        });
      }
    } catch (error) {
      // await Logger.insertMany(generateErrorLogger(loggedInUser, req, error));
      if(error.kind === ErrorKind.ID) {
        res.status(statusCodes.user_error).json({
          message: errorMessages.invalid_id_tr,
          actual_message: errorMessages.invalid_id(id)
        });
      } else {
        res.status(statusCodes.server_error).json({
          message: errorMessages.internal_tr,
          actual_message: errorMessages.internal,
          error
        });
      }
    }
  } else {
    // await Logger.insertMany(generateErrorLogger(loggedInUser, req, errorMessages.id_missing));
    res.status(statusCodes.user_error).json({
      message: errorMessages.id_missing_tr,
      actual_message: errorMessages.id_missing
    });
  }
}

exports.addNew = async (req, res) => {
  const data = { ...req.body };

  try {
    const client = await Client.find({ email: data.email });
    if (client.length > 0) {
      res.status(statusCodes.user_error).json({
        message: `Client with email [${ data.email }] already exists.`
      });
    } else {
      await Client.insertMany(data);
      const newClient = await Client.find({ email: data.email });
      res.status(statusCodes.success).json({
        message: 'Client has been added successfully.',
        client: generateClient(newClient[0])
      });
    }
  } catch (error) {
    if(error.kind === ErrorKind.ID) {
      res.status(statusCodes.user_error).json({
        message: errorMessages.invalid_id_tr,
        actual_message: errorMessages.invalid_id(id)
      });
    } else {
      res.status(statusCodes.server_error).json({
        message: errorMessages.internal_tr,
        actual_message: errorMessages.internal,
        error
      });
    }
  }
}

exports.update = async (req, res) => {

  const id = req.params.id;

  if (id) {
    try {
      const client = await Client.findById(id);
      if (client) {
        const data = { ...req.body };

        await Client.updateOne({ _id: id }, data);
        const updatedClient = await Client.findById(id);

        res.status(statusCodes.success).json({
          message: 'Client has been updated.',
          client: generateClient(updatedClient)
        });
      } else {
        // await Logger.insertMany(generateErrorLogger(loggedInUser, req, errorMessages.not_exist('Clients', id)));
        res.status(statusCodes.user_error).json({
          message: `Client with ID: [${ id }] does not exist.`
        });
      }
    } catch (error) {
      if(error.kind === ErrorKind.ID) {
        res.status(statusCodes.user_error).json({
          message: errorMessages.invalid_id_tr,
          actual_message: errorMessages.invalid_id(id)
        });
      } else {
        res.status(statusCodes.server_error).json({
          message: errorMessages.internal_tr,
          actual_message: errorMessages.internal,
          error
        });
      }
    }
  } else {
    // await Logger.insertMany(generateErrorLogger(loggedInUser, req, errorMessages.id_missing));
    res.status(statusCodes.user_error).json({
      message: errorMessages.id_missing_tr,
      actual_message: errorMessages.id_missing
    });
  }
}

exports.delete = async (req, res) => {

  const id = req.params.id;

  if (id) {
    try {
      const client = await Client.findById(id);
      if (client) {
        await Client.deleteOne({ _id: id });
        res.status(statusCodes.success).json({
          message: `Client with ID: [${ id }] has been deleted.`
        });
      } else {
        res.status(statusCodes.user_error).json({
          message: `Client with ID: [${ id }] does not exist.`
        });
      }
    } catch (error) {
      if(error.kind === ErrorKind.ID) {
        res.status(statusCodes.user_error).json({
          message: errorMessages.invalid_id_tr,
          actual_message: errorMessages.invalid_id(_id)
        });
      } else {
        res.status(statusCodes.server_error).json({
          message: errorMessages.internal_tr,
          actual_message: errorMessages.internal,
          error: error
        });
      }
    }
  } else {
    res.status(statusCodes.user_error).json({
      message: errorMessages.id_missing_tr,
      actual_message: errorMessages.id_missing
    });
  }
}