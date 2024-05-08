require('dotenv').config();

exports.errorHandler = (err, req, res, next) => {
    const errorObj = {
        status: err.status,
        error: {
            message: err.message
        }
    };

    res.status(500).json(errorObj);
}