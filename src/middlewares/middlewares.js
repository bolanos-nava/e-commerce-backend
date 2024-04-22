export function errorMiddleware(error, req, res, next) {
  let { message } = error;
  if (error.type === 'json') {
    message = JSON.parse(error.message);
  }
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: message || 'Something broke!',
  });
}

export function socketMiddleware(socketServer) {
  return (req, res, next) => {
    req.socketServer = socketServer;
    next();
  };
}
