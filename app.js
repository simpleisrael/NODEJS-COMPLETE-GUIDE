const http = require("http");
const fs = require("fs");

const rqListener = (req, res) => {
  const url = req.url;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(`
        <html>
            <head>
                <title>Response from Java Server</title>
            </head>
            <body>
                <form action="/message" method="POST">
                <input type="text" name="message" /> <button type="submit"> send </button>
                </form>
            </body>
        </html>
    `);
    res.end();
  } else if (url === "/message" && req.method === "POST") {
    const body = [];
    req.on('data', (chunk) => {
        console.log('CHUNK ====>: ', chunk);
        body.push(chunk);
    });

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        console.log('ParsedBody: ', parsedBody)
        fs.writeFileSync("message.txt", parsedBody.split('=')[1]);
    });
    
    res.statusCode = 302;
    res.setHeader("Location", "/");
    res.end();
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write(`
    <html>
        <head>
            <title>Response from Java Server</title>
        </head>
        <body>
            <h1>Welcome to my Node.JS application</h1>
        </body>
        </html>`);
    res.end();
  }
};

const server = http.createServer(rqListener);

server.listen(3000);
