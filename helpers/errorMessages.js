exports.errorMessages = {
  please_enter: (field) => `Plase enter ${ field }.`,

  user_not_exist: (email) => `User with email ${ email } does not exist.`,
  user_not_exist_tr: 'errors.userNotExist',

  internal: 'Internal server error!',
  internal_tr: 'errors.internal',

  id_missing: 'You need to provide ID.',
  id_missing_tr: 'errors.missingId',
  not_exist: (cluster, id) => `[ID: ${ id }] does not exist in ${ cluster }.`,
  invalid_id: (id) => `[ID: ${ id }] is not valid.`,
  invalid_id_tr: 'errors.invalidId',

  no_permission: 'You are not permitted to do this!',
  no_permission_tr: 'errors.noPermission',

  client_not_exist: 'Client does not exist',

  required_field: (field) => `[Field: ${ field }] is mandatory.`,
  required_field_tr: { }
};