const express = require('express');

const mainRouter = express();

const clientsRoutes = require('../routes/clients');
const companiesRoutes = require('../routes/company');
const invoiceItemsRoutes = require('../routes/invoice-items');
const invoiceRoutes = require('../routes/invoices');
const usersRoutes = require('../routes/users');

mainRouter.use('/clients', clientsRoutes);
mainRouter.use('/company', companiesRoutes);
mainRouter.use('/invoice_items', invoiceItemsRoutes);
mainRouter.use('/invoices', invoiceRoutes);
mainRouter.use('/users', usersRoutes);

module.exports = mainRouter;