"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const socket_server_1 = __importDefault(require("../socket_server"));
const http_1 = __importDefault(require("http"));
describe("my awesome project", () => {
    let clientSocket;
    let server;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const port = process.env.PORT;
        const app = yield (0, app_1.default)();
        server = http_1.default.createServer(app);
        (0, socket_server_1.default)(server);
        yield new Promise((resolve, reject) => {
            server.listen(port, () => {
                console.log(`Server listening on port ${port}`);
                clientSocket = (0, socket_io_client_1.default)(`http://localhost:${port}`);
                clientSocket.on("connect", resolve);
                clientSocket.on("connect_error", reject);
            });
        });
    }));
    afterAll(() => {
        server.close();
        clientSocket.close();
        mongoose_1.default.connection.close();
    });
    test("should work", (done) => {
        clientSocket.onAny((eventName, arg) => {
            console.log("on any");
            expect(eventName).toBe("echo");
            expect(arg.msg).toBe("hello");
            done();
        });
        clientSocket.emit("hello", { msg: "hello" });
    });
});
//# sourceMappingURL=socket.test.js.map