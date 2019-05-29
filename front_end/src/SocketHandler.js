import socketIO from "socket.io-client";

let cursor = 0;

export default class SocketHandler {
  static bin = {};

  static connect = token => {
    console.log("WS connecting...");
    this.io = socketIO("http://10.185.7.87:8080/", {
      transportOptions: {
        polling: {
          //send extra headers to socket-io
          extraHeaders: {
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            Authorization: `Bearer ${token}`
          }
        }
      }
    });
  };

  static disconnect = () => {
    this.io.disconnect(true);
  };

  static registerSocketListener = (emitType, callback) => {
    console.log("listener registered");

    this.io.on(emitType, callback);
    this.bin[++cursor] = () => this.io.off(emitType, callback);
    return cursor;
  };

  static unregisterSocketListener = id => {
    this.bin[cursor]();
  };

  static emit = (emitType, payload) => {
    this.io.emit(emitType, payload);
  };
}
