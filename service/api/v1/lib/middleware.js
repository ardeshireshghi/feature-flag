export const createPreprocessingMiddleware = (middlewareFn, nextFn) => {
  return (req, res) => {
    middlewareFn(req, res, () => {
      nextFn(req, res);
    });
  };
};
