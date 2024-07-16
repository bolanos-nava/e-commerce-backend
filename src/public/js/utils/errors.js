export const LOGIN_DICTIONARIES = {
  SERVER_ERRORS_DICTIONARY: {
    ResourceNotFoundError: 'user_not_registered',
    UnauthorizedError: 'bad_credentials',
  },
  PARAMS_MESSAGES_DICTIONARY: {
    error: 'Error inesperado',
    third_party_auth_error:
      'Error en la autenticación externa. Inténtelo de nuevo',
    user_not_registered: 'Email no se encuentra en nuestros registros',
    bad_credentials: 'Correo o contraseña incorrectas. Inténtelo de nuevo',
  },
};

export const REGISTER_DICTIONARIES = {
  SERVER_ERRORS_DICTIONARY: {
    DuplicateResourceError: 'user_exists',
    InternalServerError: 'error',
    ZodError: 'bad_form',
    UnauthorizedError: 'missing_credentials',
  },
  PARAMS_MESSAGES_DICTIONARY: {
    user_exists: 'Usuario ya registrado',
    error: 'Error inesperado',
    bad_form: 'Información inválida',
    missing_credentials: 'Credenciales faltantes',
  },
};
