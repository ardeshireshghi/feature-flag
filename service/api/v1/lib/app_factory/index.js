import http from 'http';

export function createApp() {
  const middlewares = [];

  const app = (req, res, next = () => {}) => {
    next();
  };

  const composedHandler = () => {
    return middlewares.reverse().reduce((composedHandler, middlewareFn) => {
      return (req, res) => {
        return middlewareFn(req, res, () => {
          composedHandler(req, res);
        });
      };
    }, app);
  };

  return {
    use(middlewareFn) {
      middlewares.push(middlewareFn);
    },

    listen(...thisArgs) {
      const server = http.createServer(composedHandler());
      return server.listen(...thisArgs);
    },
    handler: composedHandler
  };
}
