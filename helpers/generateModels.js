exports.generateClient = (client) => {
  const newClient = {
    id: client.id,
    client_name: client.client_name,
    email: client.email,
    phone_number: client.phone_number,
    address: client.address,
    bank_account: client.bank_account,
    tax_number: client.tax_number
  };

  return newClient;
};

exports.generateCompany = (company) => {
  const newCompany = {
    id: company.id,
    name: company.name,
    email: company.email,
    phone_number: company.phone_number,
    address: company.address,
    bank_account: company.bank_account,
    bank_name: company.bank_name,
    tax_number: company.tax_number,
    start_invoice_number: company.start_invoice_number,
    invoice_item_code: company.invoice_item_code,
    logo: company.logo
  };

  return newCompany;
};

exports.generateInvoiceItem = (invoiceItem) => {
  const newInvoiceItem = {
    id: invoiceItem.id,
    code: (new Array(3+1).join("0") + invoiceItem.code).slice(-3),
    name: invoiceItem.name,
    quantity: invoiceItem.quantity,
    price: invoiceItem.price,
    total: invoiceItem.total
  };

  return newInvoiceItem;
}

exports.generateInvoice = (invoice) => {
  const newInvoice = {
    id: invoice.id,
    client: invoice.client,
    issue_date: invoice.issue_date,
    due_date: invoice.due_date,
    items: invoice.items,
    invoice_number: invoice.invoice_number,
    price: invoice.price,
    tax: invoice.tax,
    total_price: invoice.total_price
  };

  return newInvoice;
};

exports.generateUser = (user) => {
  const newUser = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    fullname: `${ user.firstname } ${ user.lastname }`,
    email: user.email,
    company_id: user.company_id,
    registration_date: user.registration_date
  };

  return newUser;
}