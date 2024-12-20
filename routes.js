import fs from 'fs';

export default function routes(req, res, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // GET
  if(req.method === 'GET' && req.url === '/') {
    const { message } = data;

    res.statusCode = 200;
    const response = {
      message: message,
    };
    res.end(JSON.stringify(response));
    return;
  };

  // PUT
  if(req.method === 'PUT' && req.url === '/files'){
    const body = [];
    req.on('data', (part) => {
      body.push(part);
    });

    req.on('end', () => {
      const file = JSON.parse(body);
      res.statusCode = 400;

      if (!file?.name) {
        const response = {
          err: {
            message: 'Name is required to edit this file',
          },
        };
        res.end(JSON.stringify(response));
        return;
      };

      fs.writeFile(`${file.name}.txt`, file?.content ?? '', 'utf-8', (err) => {
        if (err) {
          console.log(err);
          res.statusCode = 500;

          const response = {
            err: {
              message: `Error writing file ${file.name}`
            }
          };
          res.end(JSON.stringify(response));
          return;
        }
        res.statusCode = 201;

        const response = {
          message: `File ${file.name} created with success`
        };
        res.end(JSON.stringify(response));
        return;
      })
      return;
    });

    req.on('error', (err) => {
      console.log('Failed to process your requisition', err);
      res.statusCode = 400;

      const response = {
        err: {
          message: 'Failed to process your requisition'
        }
      };
      res.end(JSON.stringify(response));
      return;
    });
    return;
  };

  // PATCH
  if(req.method === 'PATCH' && req.url === '/files'){
    const body = [];
    req.on('data', (part) => {
      body.push(part);
    });

    req.on('end', () => {
      const file = JSON.parse(body);
      res.statusCode = 400;

      if (!file?.name) {
        const response = {
          err: {
            message: 'Name is required to update this file',
          },
        };
        res.end(JSON.stringify(response));
        return;
      };

      if (!file?.content) {
        const response = {
          err: {
            message: 'Content is required to update this file',
          },
        };
        res.end(JSON.stringify(response));
        return;
      };

      fs.access(`${file.name}.txt`, fs.constants.W_OK, (err) => {
        if (err) {
          console.log('Couldnt access the file', err);
          res.statusCode = err.code === 'ENOENT' ? 404 : 500;
          
          const response = {
            err: {
              message: `Failed to access the file ${file.name}`,
            }
          };
          res.end(JSON.stringify(response));
        };
      });

      fs.writeFile(`${file.name}.txt`, file?.content ?? '', 'utf-8', (err) => {
        if (err) {
          console.log(err);
          res.statusCode = 500;

          const response = {
            err: {
              message: `Error writing file ${file.name}`
            }
          };
          res.end(JSON.stringify(response));
          return;
        }
        res.statusCode = 201;

        const response = {
          message: `File ${file.name} created with success`
        };
        res.end(JSON.stringify(response));
        return;
      })
      return;
    });

    req.on('error', (err) => {
      console.log('Failed to process your requisition', err);
      res.statusCode = 400;

      const response = {
        err: {
          message: 'Failed to process your requisition'
        }
      };
      res.end(JSON.stringify(response));
      return;
    });
    return;
  };

  res.statusCode = 404;

  const response = {
    err: {
      message: 'Not found',
      url: req.url
    }
  };
  res.end(JSON.stringify(response));
  return;
};