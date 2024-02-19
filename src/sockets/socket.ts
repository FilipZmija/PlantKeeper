import { Server as httpServer } from "http";
import { Server } from "socket.io";
import { validateTokenSocket } from "../auth/JWT.js";
import { User } from "../database/models/User.model.js";
import { CustomSocket } from "../types/local/socketIo.js";

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;
  public users: { [id: number]: string[] };

  constructor(server: httpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 5000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? process.env.CLIENT_URI
            : ["https://localhost:3000"],
      },
    });

    this.io
      .use((socket, next) => {
        validateTokenSocket(socket, next);
      })
      .on("connection", this.startListeners);
  }

  startListeners = async (socket: CustomSocket) => {
    if (socket.user) {
      const { id }: { id: number } = socket.user;

      this.users[id]
        ? this.users[id].push(socket.id)
        : (this.users[id] = [socket.id]);
    }

    socket.on("message", () => {
      socket.emit("users", this.users);
    });
  };
}
