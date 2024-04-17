export function socketMiddleware(socketServer, socketName) {
  return (req, res, next) => {
    req.socketServer = socketServer;
    next();
  };
}
