const _403Forbidden = {
  description:
    'Forbidden: User does not have the required role to perform the action',
  content: {
    'application/json': {
      example: {
        status: 'error',
        code: 'ForbiddenError',
        message: ['You are not allowed to perform this action'],
      },
    },
  },
};

export default _403Forbidden;
