export const parseUrl = req => {
  const parsedUrl = new URL(`${req.connection.encrypted ? 'https' : 'http'}://${req.headers.host}${req.url}`);

  console.log(parsedUrl);
  req.query = Object.fromEntries(new URLSearchParams(parsedUrl.search));
  req.host = req.host || parsedUrl.host;
  req.pathname = parsedUrl.pathname;
  req.protocol = parsedUrl.protocol;
};
