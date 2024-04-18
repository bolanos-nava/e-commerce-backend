export function socketMiddleware(socketServer) {
  return (req, res, next) => {
    req.socketServer = socketServer;
    next();
  };
}
