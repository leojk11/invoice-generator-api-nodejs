const User = require('../db/models/user');

const { statusCodes } = require('../helpers/statusCodes');
const { errorMessages } = require('../helpers/errorMessages');
const { generateUser } = require('../helpers/generateModels');

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
    const users = await User.find(filters).sort({ _id: 'desc' })
      .skip(skip).limit(parseInt(req.query.take));
    const usersCount = await User.find().count();

    res.status(statusCodes.success).json({
      page: parseInt(req.query.page),
      total: usersCount,
      list: users.map(user => generateUser(user))
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
      const user = await User.findById(id);
      if (user) {
        res.status(statusCodes.success).send(generateUser(user));
      } else {
        res.status(statusCodes.user_error).json({
          message: errorMessages.not_exist('User', id)
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
    await User.insertMany(data);
    const newUser = await User.find({ email: data.email });
    res.status(statusCodes.success).json({
      message: 'User has been added successfully.',
      user: generateUser(newUser[0])
    });
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
}

exports.update = async (req, res) => {

  const id = req.params.id;

  if (id) {
    try {
      const user = await User.findById(id);
      if (user) {
        const data = { ...req.body };

        await User.updateOne({ _id: id }, data);
        const updatedUser = await User.findById(id);

        res.status(statusCodes.success).json({
          message: 'User has been updated.',
          user: generateUser(updatedUser)
        });
      } else {
        res.status(statusCodes.user_error).json({
          message: errorMessages.not_exist('User', id)
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
      const user = await User.findById(id);
      if (user) {
        await User.deleteOne({ _id: id });
        res.status(statusCodes.success).json({
          message: `User with ID: [${ id }] has been deleted.`
        });
      } else {
        res.status(statusCodes.user_error).json({
          message: `User with ID: [${ id }] does not exist.`
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