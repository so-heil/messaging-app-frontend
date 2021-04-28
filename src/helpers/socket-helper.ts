import io, { Socket } from "socket.io-client";
import { SimpleEventDispatcher } from "strongly-typed-events";

export abstract class SocketHelper {
    private socket!: Socket;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private events: { [index: string]: (e: any) => void } = {};

    public constructor() {
        this.connectSocket()
            .then((socket) => (this.socket = socket))
            .catch((error) => console.log(error));
    }

    private onSocketConnected = (socket: Socket) => {
        for (const event in this.events) {
            const callback = this.events[event];
            socket.on(event, callback);
        }
    };

    private connectSocket = (): Promise<Socket> => {
        //this.socket = io("ws//localhost:3000", { query: { roomId } });
        return new Promise<Socket>((resolve, reject) => {
            if (this.socket) {
                resolve(this.socket);
                return;
            }
            const socketClient = io("http://localhost:3001", {
                reconnection: false,
                forceNew: false,
            });

            let hasResolved = false;
            socketClient.once("connect", () => {
                console.log("Socket Connected!");
                if (hasResolved) {
                    return;
                }

                hasResolved = true;
                this.onSocketConnected(socketClient);
                resolve(socketClient);
            });

            socketClient.once("connect_error", (e: unknown) => {
                if (hasResolved) {
                    return;
                }
                hasResolved = true;
                reject(e);
            });

            socketClient.once("connect_failed", (e: unknown) => {
                if (hasResolved) {
                    return;
                }
                hasResolved = true;
                reject(e);
            });

            socketClient.once("disconnect", (e: unknown) => {
                if (hasResolved) {
                    return;
                }
                hasResolved = true;
                reject(e);
            });

            socketClient.once("error", (e: unknown) => {
                if (hasResolved) {
                    return;
                }
                hasResolved = true;
                reject(e);
            });
        });
    };

    protected registerEvent<T>(
        event: string,
        callback: SimpleEventDispatcher<T> | ((response: T) => void),
    ): void {
        if (typeof callback != "function") {
            const dispatcher = callback;
            callback = (e) => dispatcher.dispatch(e);
        }
        this.events[event] = callback;
    }

    protected sendEvent<TRequestBody>(
        event: string,
        body: TRequestBody,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback?: (res: any) => void,
        time?: number,
    ): void {
        if (this.socket) {
            this.socket.emit(event, body);
            callback && this.socket.once(`${event}_RESULT`, callback);
        } else {
            const timer = time ?? 500;
            console.log(
                `No socket connection initiated, resending event in ${timer}ms`,
            );
            setTimeout(() => {
                this.sendEvent(event, body, callback, timer + 500);
            }, timer);
        }
    }
}
