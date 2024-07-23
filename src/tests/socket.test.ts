import init from "../app";
import mongoose from "mongoose";
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import io from "../socket_server";
import http from "http";

describe("my awesome project", () => {
    let clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
    let server: http.Server;

    beforeAll(async () => {
        const port = process.env.PORT;
        const app = await init();
        server = http.createServer(app);
        io(server);

        await new Promise<void>((resolve, reject) => {
            server.listen(port, () => {
                console.log(`Server listening on port ${port}`);
                clientSocket = Client(`http://localhost:${port}`);
                clientSocket.on("connect", resolve);
                clientSocket.on("connect_error", reject);
            });
        });
    });

    afterAll(() => {
        server.close();
        clientSocket.close();
        mongoose.connection.close();
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
