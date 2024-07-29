import init from "./app";
const port = process.env.PORT;
import io from "./socket_server";
import http from "http";
import https from 'https'
import fs from 'fs'
init().then((app) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("development");
    const server = http.createServer(app);
    io(server);
    server.listen(process.env.PORT);
  } else {
    console.log("PRODUCTION");
    const options2 = {
      key: fs.readFileSync("../client-key.pem"),
      cert: fs.readFileSync("../client-cert.pem"),
      ca: fs.readFileSync("../ca.cert.pem"),
    };
    const server=https.createServer(options2, app)
    io(server);
    server.listen(process.env.HTTPS_PORT);
  }
});
