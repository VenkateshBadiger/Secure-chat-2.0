import socketIOClient, { Socket } from 'socket.io-client';
import { Logger } from '../utils/logger';
import { chatJoinPayloadType } from '../sdk';
import { configContext } from '../configContext';
export type SocketListenerType = "limit-reached" | "delivered" | "on-alice-join" | "on-alice-disconnect" | "chat-message" | "webrtc-session-description";

export type SubscriptionType = Map<SocketListenerType, Set<Function>>;
export type SubscriptionContextType = () => SubscriptionType;

const SOCKET_LISTENERS: Record<string, SocketListenerType> = {
    'LIMIT_REACHED': "limit-reached",
    'DELIVERED': "delivered",
    'ON_ALICE_JOIN': "on-alice-join",
    'ON_ALICE_DISCONNECT': "on-alice-disconnect",
    'CHAT_MESSAGE': "chat-message",
    "WEBRTC_SESSION_DESCRIPTION": "webrtc-session-description"
}

const getBaseURL = (): string => {
    const { socketURL } = configContext();
    return socketURL || '';
}


export class SocketInstance {
    private socket: Socket;

    private eventHandlerLogger = this.logger.createChild('eventHandlerLogger');
    constructor(private subscriptionContext: () => SubscriptionType, private logger: Logger) {
        this.socket = socketIOClient(`${getBaseURL()}/`);
        this.socket.on(SOCKET_LISTENERS.LIMIT_REACHED, (...args) => this.handler(SOCKET_LISTENERS.LIMIT_REACHED, args));
        this.socket.on(SOCKET_LISTENERS.DELIVERED, (...args) => this.handler(SOCKET_LISTENERS.DELIVERED, args));
        this.socket.on(SOCKET_LISTENERS.ON_ALICE_JOIN, (...args) => this.handler(SOCKET_LISTENERS.ON_ALICE_JOIN, args));
        this.socket.on(SOCKET_LISTENERS.ON_ALICE_DISCONNECT, (...args) => this.handler(SOCKET_LISTENERS.ON_ALICE_DISCONNECT, args));
        this.socket.on(SOCKET_LISTENERS.CHAT_MESSAGE, (...args) => {
            this.handler(SOCKET_LISTENERS.CHAT_MESSAGE, args);
            this.markDelivered(args[0]);
        });
        this.socket.on(SOCKET_LISTENERS.WEBRTC_SESSION_DESCRIPTION, (...args) => this.handler(SOCKET_LISTENERS.WEBRTC_SESSION_DESCRIPTION, args))
        logger.log('Initiialized');
    }

    public joinChat(payload: chatJoinPayloadType): void {
        const { publicKey, ...rest } = payload;
        this.logger.log(`joinChat(), publicKey removed from log, ${JSON.stringify(rest)}`);
        this.socket.emit('chat-join', payload)
    }

    public dispose(): void {
        this.logger.log(`disconnect()`);
        this.socket.disconnect();
    }

    private handler(listener: SocketListenerType, args) {
        const loggerWithCount = this.eventHandlerLogger.count();
        loggerWithCount.log(`handler called for ${listener}`);
        const callbacks = this.subscriptionContext().get(listener);
        callbacks?.forEach(fn => fn(...args));
    }

    private markDelivered(msg) {
        this.logger.log(`markDelivered()`);
        this.socket.emit('received', { channel: msg.channel, sender: msg.sender, id: msg.id })
    }
}