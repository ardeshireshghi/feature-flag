export const parseReqBody = req => {
  const data = [];

  return new Promise((resolve, reject) => {
    req.on('data', chunk => {
      data.push(chunk);
    });

    req.on('end', () => {
      resolve(JSON.parse(Buffer.concat(data)));
    });

    req.on('error', err => {
      reject(err);
    });
  });
};
