import http from 'http';

export function createApp() {
  const middlewares = [];

  const app = (req, res, next = () => {}) => {
    next();
  };

  return {
    use(middlewareFn) {
      middlewares.push(middlewareFn);
    },

    listen(...thisArgs) {
      const composedHandler = middlewares.reverse().reduce((composedHandler, middlewareFn) => {
        return (req, res) => {
          return middlewareFn(req, res, () => {
            composedHandler(req, res);
          });
        };
      }, app);

      const server = http.createServer(composedHandler);
      return server.listen(...thisArgs);
    }
  };
}
