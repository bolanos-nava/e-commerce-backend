/** @type {import('swagger-jsdoc').SecurityScheme} */
const jwtCookie = {
  type: 'apiKey',
  in: 'cookie',
  name: 'token',
  description: 'JWT token for authentication sent in cookies',
};

export default jwtCookie;
