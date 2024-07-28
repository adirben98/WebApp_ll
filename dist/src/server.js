"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT;
const socket_server_1 = __importDefault(require("./socket_server"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
(0, app_1.default)().then((app) => {
    if (process.env.NODE_ENV !== "production") {
        console.log("development");
        const server = http_1.default.createServer(app);
        (0, socket_server_1.default)(server);
        server.listen(process.env.PORT);
    }
    else {
        console.log("PRODUCTION");
        const options2 = {
            key: fs_1.default.readFileSync("../client-key.pem"),
            cert: fs_1.default.readFileSync("../client-cert.pem"),
        };
        const server = https_1.default.createServer(options2, app);
        (0, socket_server_1.default)(server);
        server.listen(process.env.HTTPS_PORT);
    }
});
//# sourceMappingURL=server.js.map