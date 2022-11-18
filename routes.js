
const fs = require("fs");


const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
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
      } else if (url === "/message" && method === "POST") {
        const body = [];
        req.on('data', (chunk) => {
            console.log('CHUNK ====>: ', chunk);
            body.push(chunk);
        });
    
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log('ParsedBody: ', parsedBody)
            fs.writeFile("message.txt", parsedBody.split('=')[1], (err) => {
                res.statusCode = 302;
                res.setHeader("Location", "/");
                res.end();
            });
        });
    
        
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
}

exports.handler = requestHandler;