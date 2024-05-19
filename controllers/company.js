const Company = require('../db/models/company');

const { statusCodes } = require('../helpers/statusCodes');
const { errorMessages } = require('../helpers/errorMessages');
const { generateCompany } = require('../helpers/generateModels');

const { ErrorKind } = require('../enums/errorKind');

const { getLoggedInUser } = require('../middlewares/common');

exports.getAll = async (req, res) => {

  let skip = 0;
  if(parseInt(req.query.page) === 1) {
    skip = 0;
  } else {
    skip = (parseInt(req.query.take) * parseInt(req.query.page)) - parseInt(req.query.take);
  }

  const filters = {};

  try {
    const companies = await Company.find(filters).sort({ _id: 'desc' })
      .skip(skip).limit(parseInt(req.query.take));
    const companiesCount = await Company.find().count();

    res.status(statusCodes.success).json({
      page: parseInt(req.query.page),
      total: companiesCount,
      list: companies.map(company => generateCompany(company))
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
      const company = await Company.findById(id);
      if (company) {
        res.status(statusCodes.success).send(generateCompany(company));
      } else {
        res.status(statusCodes.user_error).json({
          message: errorMessages.not_exist('Company', id)
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
    await Company.insertMany(data);
    const newCompany = await Company.find({ email: data.email });
    res.status(statusCodes.success).json({
      message: 'Company has been added successfully.',
      company: generateCompany(newCompany[0])
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

exports.createCompanyByUser = async (req, res) => {
  
	const loggedInUser = getLoggedInUser(req);

  
}

exports.update = async (req, res) => {

  const id = req.params.id;

  if (id) {
    try {
      const company = await Company.findById(id);
      if (company) {
        const data = { ...req.body };

        await Company.updateOne({ _id: id }, data);
        const updatedCompany = await Company.findById(id);

        res.status(statusCodes.success).json({
          message: 'Company has been updated.',
          company: generateCompany(updatedCompany)
        });
      } else {
        res.status(statusCodes.user_error).json({
          message: errorMessages.not_exist('Company', id)
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
      const company = await Company.findById(id);
      if (company) {
        await Company.deleteOne({ _id: id });
        res.status(statusCodes.success).json({
          message: `Company with ID: [${ id }] has been deleted.`
        });
      } else {
        res.status(statusCodes.user_error).json({
          message: `Company with ID: [${ id }] does not exist.`
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