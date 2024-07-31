import init from "../app";
import mongoose from "mongoose";
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import io from "../socket_server";
import http from "http";
import request from "supertest";
import User from "../models/userModel";
import { App } from "supertest/types";
import Room from "../models/Room";

let clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
let server: http.Server;
let app: App;
let accessToken: string;

const user = {
  email: "Idan123@gmail.com",
  username: "Idan the chef123",
  password: "1234",
};

beforeAll(async () => {
  const port = process.env.PORT || 3000;
  app = await init();

  await User.deleteMany({});
  await Room.deleteMany({});
  
  const res = await request(app).post("/auth/register").send(user);
  accessToken = res.body.accessToken;
  console.log(accessToken)

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

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
  clientSocket.close();
});

describe("Socket io", () => {
  test("should work with socket.io", (done) => {
    clientSocket.onAny((eventName, arg) => {
      console.log("on any");
      expect(eventName).toBe("echo");
      expect(arg.msg).toBe("hello");
      done();
    });

    clientSocket.emit("hello", { msg: "hello" });
  });

  test("should check if room exists", async () => {
    const response = await request(app)
      .get("/rooms/check/testRoomId")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.exists).toBe(false); 
  });

  test("should create a new room", async () => {
    const response = await request(app)
      .post("/rooms/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ roomId: "newRoomId", users: ["user1", "user2"] });
    expect(response.status).toBe(201);
    expect(response.body.roomId).toBe("newRoomId");
  });

  test("should retrieve messages for a room", async () => {
    const response = await request(app)
      .get("/rooms/testRoomId/messages")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("should get my rooms", async () => {
    const response = await request(app)
      .get("/rooms/getmyrooms")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
