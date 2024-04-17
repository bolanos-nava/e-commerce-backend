export function socketMiddleware(socketServer, socketName) {
  return (req, res, next) => {
    req[socketName || 'socketServer'] = socketServer;
    next();
  };
}
