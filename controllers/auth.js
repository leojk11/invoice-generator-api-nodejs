const User = require('../db/models/user');

const { statusCodes } = require('../helpers/statusCodes');
const { errorMessages } = require('../helpers/errorMessages');
const { generateUser } = require('../helpers/generateModels');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

exports.login = async (req, res) => {

  const data = req.body;

  if (!data.email || !data.password) {
    res.status(statusCodes.user_error).json({
      message: 'Email or password is missing.'
    });
  } else {
    try {
      const users = await User.find({ email: data.email });
      console.log(users);
      if (users.length === 0) {
        res.status(statusCodes.user_error).json({
          message: `User with email [${ data.email }] does not exist.`
        });
      } else {
        if(bcrypt.compareSync(data.password, users[0].password)) {
          const token = jwt.sign(
            { ...generateUser(users[0]) }, 
            process.env.SECRET,
            // { expiresIn: '1h' }
          );

          res.status(statusCodes.success).json({
            user: generateUser(users[0]),
            token
          });
        } else {
          res.status(statusCodes.user_error).json({
            message: 'Email or password for user is wrong.'
          });
        }
      }
    } catch (error) {
      console.log('error', error);
      res.status(statusCodes.server_error).json({
        message: errorMessages.internal_tr,
        actual_message: errorMessages.internal,
        error
      });
    }
  }
}

exports.register = async (req, res) => {
  const data = { 
    ...req.body,
    registration_date: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')
  };

  if (!data.firstname || data.firstname === '') {
    res.status(statusCodes.user_error).json({
      message: 'Firstname is mandatory.'
    });
  } else if (!data.lastname || data.lastname === '') {
    res.status(statusCodes.user_error).json({
      message: 'Lastname is mandatory.'
    });
  } else if (!data.email || data.email === '') {
    res.status(statusCodes.user_error).json({
      message: 'Email is mandatory.'
    });
  } else if (!data.password || data.password === '') {
    res.status(statusCodes.user_error).json({
      message: 'Password is mandatory.'
    });
  } else {
    try {
      const usersByEmail = await User.find({ email: data.email });
      if (usersByEmail.length > 0) {
        res.status(statusCodes.user_error).json({
          message: `User with email: [${ data.email }] already exists.`
        });
      } else {
        if (PASSWORD_REGEX.test(data.password)) {
          data['password'] = bcrypt.hashSync(req.body.password, 20);

          const newUser = await User.insertMany(data);
          res.status(statusCodes.success).json({
            message: 'User has been added successfully.',
            user: generateUser(newUser[0])
          });
        } else {
          res.status(statusCodes.user_error).json({
            message: `Password must be at least characters long, contain one number and letter and one special character.`
          });
        }
      }
    } catch (error) {
      res.status(statusCodes.server_error).json({
        message: errorMessages.internal_tr,
        actual_message: errorMessages.internal,
        error
      });
    }
  }
}