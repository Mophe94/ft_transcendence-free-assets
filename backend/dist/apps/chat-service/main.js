/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/chat-service/src/app.controller.ts"
/*!*************************************************!*\
  !*** ./apps/chat-service/src/app.controller.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatServiceController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./apps/chat-service/src/app.service.ts");
let ChatServiceController = class ChatServiceController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.ChatServiceController = ChatServiceController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ChatServiceController.prototype, "getHello", null);
exports.ChatServiceController = ChatServiceController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.ChatAppService !== "undefined" && app_service_1.ChatAppService) === "function" ? _a : Object])
], ChatServiceController);


/***/ },

/***/ "./apps/chat-service/src/app.module.ts"
/*!*********************************************!*\
  !*** ./apps/chat-service/src/app.module.ts ***!
  \*********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatServiceModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./apps/chat-service/src/app.controller.ts");
const chat_module_1 = __webpack_require__(/*! ./chat/chat.module */ "./apps/chat-service/src/chat/chat.module.ts");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const health_module_1 = __webpack_require__(/*! libs/shared/src/health/health.module */ "./libs/shared/src/health/health.module.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./apps/chat-service/src/app.service.ts");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
let ChatServiceModule = class ChatServiceModule {
};
exports.ChatServiceModule = ChatServiceModule;
exports.ChatServiceModule = ChatServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [chat_module_1.ChatModule, health_module_1.HealthModule, event_emitter_1.EventEmitterModule.forRoot()],
        controllers: [app_controller_1.ChatServiceController],
        providers: [app_service_1.ChatAppService, jwt_1.JwtService],
    })
], ChatServiceModule);


/***/ },

/***/ "./apps/chat-service/src/app.service.ts"
/*!**********************************************!*\
  !*** ./apps/chat-service/src/app.service.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatAppService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let ChatAppService = class ChatAppService {
    getHello() {
        return 'Hello';
    }
};
exports.ChatAppService = ChatAppService;
exports.ChatAppService = ChatAppService = __decorate([
    (0, common_1.Injectable)()
], ChatAppService);


/***/ },

/***/ "./apps/chat-service/src/chat/chat.controller.ts"
/*!*******************************************************!*\
  !*** ./apps/chat-service/src/chat/chat.controller.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatController_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_http_guard_1 = __webpack_require__(/*! libs/shared/src/auth/guards/jwt-http.guard */ "./libs/shared/src/auth/guards/jwt-http.guard.ts");
const chat_service_1 = __webpack_require__(/*! ./chat.service */ "./apps/chat-service/src/chat/chat.service.ts");
const chat_gateway_1 = __webpack_require__(/*! ./chat.gateway */ "./apps/chat-service/src/chat/chat.gateway.ts");
const messageEvent_1 = __webpack_require__(/*! ./const/messageEvent */ "./apps/chat-service/src/chat/const/messageEvent.ts");
let ChatController = ChatController_1 = class ChatController {
    chatGateway;
    chatService;
    logger = new common_1.Logger(ChatController_1.name);
    constructor(chatGateway, chatService) {
        this.chatGateway = chatGateway;
        this.chatService = chatService;
    }
    getOnlineUsers(req) {
        const user = req.user;
        const onlineUsers = this.chatService.getOnlineUsersIds();
        this.logger.log(`[HTTP GET /online] Requested by User: ${user?.username} - Returned ${onlineUsers.length} online user(s)`);
        return onlineUsers;
    }
    checkOnlineUsers(req, usersDto) {
        const user = req.user;
        const users = usersDto.users;
        users.map((user) => {
            user.isOnline = this.chatService.isOnline(user.id);
        });
        this.logger.log(`[HTTP POST /online_users] Requested by User: ${user?.id} - Checked ${users.length} user(s)`);
        return { users };
    }
    getStatus(req, id) {
        const user = req.user;
        const isOnline = this.chatService.isOnline(id);
        this.logger.log(`[HTTP GET /:id/status] Requested by User: ${user?.id} - Checked status for Target User: ${id} (Online: ${isOnline})`);
        return { online: isOnline };
    }
    sendFriendRequestNotif(body) {
        this.logger.log(`Receiving request for sending notification: ${body.destinatoryId}`);
        const isSent = this.chatGateway.sendNotifToUser(body.destinatoryId, messageEvent_1.MessageEvent.FRIEND_REQUEST, { from: body.senderId });
        this.logger.log(`[INTERNAL POST /send_request_notif] Friend request notification from Sender: ${body.senderId} -> Target: ${body.destinatoryId} (Delivered: ${isSent})`);
        return { success: true, delivered: isSent };
    }
    sendGameInvite(body) {
        this.logger.log(`Receiving request for sending game_invite: ${body.destinatoryId}`);
        if (body.senderId === body.destinatoryId) {
            this.logger.warn(`[INTERNAL POST /send_game_invite] User ${body.senderId} attempted to add themselves`);
            throw new common_1.BadRequestException('Cannot invite yourself');
        }
        const isSent = this.chatGateway.sendNotifToUser(body.destinatoryId, messageEvent_1.MessageEvent.GAME_INVITE, { from: body.senderUsername, roomId: body.roomId });
        this.logger.log(`[INTERNAL POST /send_game_invite] Game invite for room ${body.roomId} from Sender: ${body.senderId} -> Target: ${body.destinatoryId} (Delivered: ${isSent})`);
        return { success: true, delivered: isSent };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('online'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getOnlineUsers", null);
__decorate([
    (0, common_1.Post)('online_users'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "checkOnlineUsers", null);
__decorate([
    (0, common_1.Get)('/:id/status'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('/send_request_notif'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "sendFriendRequestNotif", null);
__decorate([
    (0, common_1.Post)('/send_game_invite'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "sendGameInvite", null);
exports.ChatController = ChatController = ChatController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof chat_gateway_1.ChatGateway !== "undefined" && chat_gateway_1.ChatGateway) === "function" ? _a : Object, typeof (_b = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _b : Object])
], ChatController);


/***/ },

/***/ "./apps/chat-service/src/chat/chat.gateway.ts"
/*!****************************************************!*\
  !*** ./apps/chat-service/src/chat/chat.gateway.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ChatGateway_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const ws_1 = __webpack_require__(/*! ws */ "ws");
const shared_auth_service_1 = __webpack_require__(/*! libs/shared/src/auth/shared-auth.service */ "./libs/shared/src/auth/shared-auth.service.ts");
const chat_service_1 = __webpack_require__(/*! ./chat.service */ "./apps/chat-service/src/chat/chat.service.ts");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
const messageEvent_1 = __webpack_require__(/*! ./const/messageEvent */ "./apps/chat-service/src/chat/const/messageEvent.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    wsAuthService;
    chatService;
    server;
    heartbeatInterval;
    logger = new common_1.Logger(ChatGateway_1.name);
    constructor(wsAuthService, chatService) {
        this.wsAuthService = wsAuthService;
        this.chatService = chatService;
    }
    destroy() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
    }
    afterInit(server) {
        this.logger.log('[WS INIT] Heartbeat check interval initialized (30s)');
        this.heartbeatInterval = setInterval(() => {
            server.clients.forEach((wsClient) => {
                const client = wsClient;
                if (client.isAlive === false) {
                    this.logger.warn(`[WS HEARTBEAT] Terminating inactive connection. Socket: ${client.id || 'unknown'} - User: ${client.user?.id || 'unknown'}`);
                    return client.terminate();
                }
                client.isAlive = false;
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    client.ping();
                }
            });
        }, 30000);
    }
    async handleConnection(client, request) {
        const clientIp = this.extractClientIp(request);
        try {
            const user = await this.wsAuthService.verifyWsHandshake(request);
            if (!user.id) {
                this.logger.warn(`[WS REJECTED] Handshake succeeded but missing user ID. IP: ${clientIp}. Closing connection.`);
                client.close(1008, 'Unauthorized');
                return;
            }
            this.logger.log(`[WS USER IDENTIFIED] User: ${user.username} (${user.id}) - IP: ${clientIp}`);
            client.id = (0, crypto_1.randomUUID)();
            client.user = user;
            this.logger.log(`[WS MAPPING] Association Socket: ${client.id} -> User: ${client.user.id}`);
            this.chatService.addConnection(client.user.id, client.id);
            client.isAlive = true;
            client.on('pong', () => {
                client.isAlive = true;
            });
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            this.logger.warn(`[WS CONNECT FAILED] Connection initiation failed: ${reason} - IP: ${clientIp}`);
            client.close(1008, 'Unauthorized');
        }
    }
    handleDisconnect(client) {
        if (!client?.user || client.id === undefined) {
            this.logger.warn('[WS DISCONNECT] Disconnected client missing user session or socket ID.');
            return;
        }
        this.chatService.removeConnection(client.user.id, client.id);
        this.logger.log(`[WS DISCONNECTED] Socket: ${client.id} -> User: ${client.user.id}`);
    }
    handleMessage(client, content) {
        this.logger.log(`[WS MESSAGE] Received from User: ${client.user?.username} (${client.user?.id}) - Socket: ${client.id}`);
        const date = new Date();
        const sender = client.user?.username;
        const message = {
            type: messageEvent_1.MessageEvent.CHAT_MESSAGE,
            time: date,
            username: sender,
            content,
        };
        this.broadcast(message);
    }
    broadcast(message) {
        let recipientCount = 0;
        this.server.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(JSON.stringify(message));
                recipientCount++;
            }
        });
        const msgType = message.type || 'UNKNOWN';
        this.logger.log(`[WS BROADCAST] Event: ${msgType} -> Sent to ${recipientCount} active client(s)`);
    }
    extractClientIp(req) {
        const xForwardedFor = req.headers['x-forwarded-for'];
        if (xForwardedFor) {
            const ips = (Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor).split(',');
            return ips[0].trim();
        }
        return req.socket.remoteAddress || 'unknown';
    }
    sendNotifToUser(userId, type, origin) {
        const sockets = this.chatService.getUserSockets(userId);
        if (!sockets || sockets.length === 0) {
            this.logger.log(`[WS NOTIFY SKIPPED] User: ${userId} has no active sockets.`);
            return false;
        }
        const socketIds = new Set(sockets.map((c) => c.socketId));
        const payload = JSON.stringify({
            type,
            origin,
            time: new Date().toISOString(),
        });
        let sentCount = 0;
        this.server.clients.forEach((client) => {
            if (client.id &&
                socketIds.has(client.id) &&
                client.readyState === ws_1.WebSocket.OPEN) {
                client.send(payload);
                sentCount++;
            }
        });
        if (sentCount > 0) {
            this.logger.log(`[WS NOTIFY SUCCESS] Event: ${type} -> Delivered to ${sentCount}/${sockets.length} socket(s) for User: ${userId}`);
        }
        else {
            this.logger.warn(`[WS NOTIFY FAILED] Event: ${type} -> Sockets found (${sockets.length}) but none were OPEN for User: ${userId}`);
        }
        return sentCount > 0;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_c = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _c : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' }, path: '/chat' }),
    __metadata("design:paramtypes", [typeof (_a = typeof shared_auth_service_1.SharedAuthService !== "undefined" && shared_auth_service_1.SharedAuthService) === "function" ? _a : Object, typeof (_b = typeof chat_service_1.ChatService !== "undefined" && chat_service_1.ChatService) === "function" ? _b : Object])
], ChatGateway);


/***/ },

/***/ "./apps/chat-service/src/chat/chat.module.ts"
/*!***************************************************!*\
  !*** ./apps/chat-service/src/chat/chat.module.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const chat_service_1 = __webpack_require__(/*! ./chat.service */ "./apps/chat-service/src/chat/chat.service.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const shared_auth_module_1 = __webpack_require__(/*! libs/shared/src/auth/shared-auth.module */ "./libs/shared/src/auth/shared-auth.module.ts");
const chat_controller_1 = __webpack_require__(/*! ./chat.controller */ "./apps/chat-service/src/chat/chat.controller.ts");
const chat_gateway_1 = __webpack_require__(/*! ./chat.gateway */ "./apps/chat-service/src/chat/chat.gateway.ts");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            shared_auth_module_1.SharedJwtModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_gateway_1.ChatGateway, chat_service_1.ChatService],
    })
], ChatModule);


/***/ },

/***/ "./apps/chat-service/src/chat/chat.service.ts"
/*!****************************************************!*\
  !*** ./apps/chat-service/src/chat/chat.service.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let ChatService = class ChatService {
    onlineUsers = new Map();
    addConnection(userId, socketId) {
        const currentConnections = this.onlineUsers.get(userId) || [];
        currentConnections.push({ socketId, connectedAt: new Date() });
        this.onlineUsers.set(userId, currentConnections);
    }
    removeConnection(userId, socketId) {
        const connections = this.onlineUsers.get(userId);
        if (!connections)
            return;
        const remainingConnections = connections.filter((conn) => conn.socketId !== socketId);
        if (remainingConnections.length > 0) {
            this.onlineUsers.set(userId, remainingConnections);
        }
        else {
            this.onlineUsers.delete(userId);
        }
    }
    getUserSockets(userId) {
        return this.onlineUsers.get(userId);
    }
    isOnline(userId) {
        return this.onlineUsers.has(userId);
    }
    getOnlineUsersIds() {
        return Array.from(this.onlineUsers.keys());
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);


/***/ },

/***/ "./apps/chat-service/src/chat/const/messageEvent.ts"
/*!**********************************************************!*\
  !*** ./apps/chat-service/src/chat/const/messageEvent.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageEvent = void 0;
var MessageEvent;
(function (MessageEvent) {
    MessageEvent["FRIEND_REQUEST"] = "friend_request";
    MessageEvent["GAME_INVITE"] = "game_invite";
    MessageEvent["CHAT_MESSAGE"] = "message";
})(MessageEvent || (exports.MessageEvent = MessageEvent = {}));


/***/ },

/***/ "./apps/chat-service/src/main.ts"
/*!***************************************!*\
  !*** ./apps/chat-service/src/main.ts ***!
  \***************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./apps/chat-service/src/app.module.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const platform_ws_1 = __webpack_require__(/*! @nestjs/platform-ws */ "@nestjs/platform-ws");
const cookie_parser_1 = __importDefault(__webpack_require__(/*! cookie-parser */ "cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.ChatServiceModule);
    const configService = app.get(config_1.ConfigService);
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    const port = configService.get('CHAT_SERVICE_PORT') || 3000;
    app.use((0, cookie_parser_1.default)());
    await app.listen(port);
}
void bootstrap();


/***/ },

/***/ "./libs/shared/src/auth/guards/jwt-http.guard.ts"
/*!*******************************************************!*\
  !*** ./libs/shared/src/auth/guards/jwt-http.guard.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtHttpGuard_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtHttpGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
let JwtHttpGuard = JwtHttpGuard_1 = class JwtHttpGuard {
    jwtService;
    logger = new common_1.Logger(JwtHttpGuard_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        const token = this.extractTokenFromCookie(request);
        if (!token) {
            this.logger.warn(`[AUTH FAIL] ${method} ${url} - IP: ${ip} - Missing or invalid token. Request Aborted.`);
            throw new common_1.UnauthorizedException('Missing JWT');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            request['user'] = payload;
            this.logger.log(`[AUTH SUCCESS] ${method} ${url} - User: ${payload.id} - IP: ${ip}`);
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired JWT');
        }
    }
    extractTokenFromCookie(request) {
        if (request.cookies && request.cookies['access_token']) {
            const token = request.cookies['access_token'];
            if (typeof token === 'string') {
                return token;
            }
        }
        return undefined;
    }
};
exports.JwtHttpGuard = JwtHttpGuard;
exports.JwtHttpGuard = JwtHttpGuard = JwtHttpGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], JwtHttpGuard);


/***/ },

/***/ "./libs/shared/src/auth/guards/jwt-ws.guard.ts"
/*!*****************************************************!*\
  !*** ./libs/shared/src/auth/guards/jwt-ws.guard.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtWsGuard_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtWsGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const http_1 = __webpack_require__(/*! http */ "http");
const url = __importStar(__webpack_require__(/*! url */ "url"));
let JwtWsGuard = JwtWsGuard_1 = class JwtWsGuard {
    jwtService;
    logger = new common_1.Logger(JwtWsGuard_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const request = this.extractRequest(context, client);
        const token = this.extractToken(request);
        const event = context.switchToWs().getPattern() ||
            context.getHandler()?.name ||
            'WS Event';
        if (!token) {
            this.logger.warn(`[WS 401] Event: "${event}" - Socket: ${client?.user?.id || 'N/A'} - Missing token`);
            throw new websockets_1.WsException('Missing JWT');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            client.user = payload;
            this.logger.log(`[WS AUTH SUCCESS] Event: "${event}" - Socket: ${client.user.id} - User: ${payload.username}`);
            return true;
        }
        catch {
            this.logger.warn(`[WS 401] Event: "${event}" - Socket: ${client?.user?.id || 'N/A'} - Invalid or expired JWT`);
            throw new websockets_1.WsException('Invalid JWT or expired');
        }
    }
    extractRequest(context, client) {
        const wsData = context.switchToWs().getData();
        if ('upgradeReq' in client &&
            client.upgradeReq instanceof http_1.IncomingMessage) {
            return client.upgradeReq;
        }
        if (wsData &&
            typeof wsData === 'object' &&
            wsData.req instanceof http_1.IncomingMessage) {
            return wsData.req;
        }
        return undefined;
    }
    extractToken(request) {
        if (!request) {
            return undefined;
        }
        if (typeof request.url === 'string') {
            const parsedUrl = url.parse(request.url, true);
            const tokenQuery = parsedUrl.query.token;
            if (typeof tokenQuery === 'string') {
                return tokenQuery;
            }
        }
        const authHeader = request.headers.authorization;
        if (typeof authHeader === 'string') {
            const parts = authHeader.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                return parts[1];
            }
        }
        return undefined;
    }
};
exports.JwtWsGuard = JwtWsGuard;
exports.JwtWsGuard = JwtWsGuard = JwtWsGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], JwtWsGuard);


/***/ },

/***/ "./libs/shared/src/auth/shared-auth.module.ts"
/*!****************************************************!*\
  !*** ./libs/shared/src/auth/shared-auth.module.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedJwtModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const jwt_http_guard_1 = __webpack_require__(/*! ./guards/jwt-http.guard */ "./libs/shared/src/auth/guards/jwt-http.guard.ts");
const jwt_ws_guard_1 = __webpack_require__(/*! ./guards/jwt-ws.guard */ "./libs/shared/src/auth/guards/jwt-ws.guard.ts");
const secret_utils_1 = __webpack_require__(/*! ../utils/secret.utils */ "./libs/shared/src/utils/secret.utils.ts");
const shared_auth_service_1 = __webpack_require__(/*! ./shared-auth.service */ "./libs/shared/src/auth/shared-auth.service.ts");
let SharedJwtModule = class SharedJwtModule {
};
exports.SharedJwtModule = SharedJwtModule;
exports.SharedJwtModule = SharedJwtModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: () => ({
                    secret: (0, secret_utils_1.getSecret)('jwt_secret_key'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
        ],
        providers: [jwt_http_guard_1.JwtHttpGuard, jwt_ws_guard_1.JwtWsGuard, shared_auth_service_1.SharedAuthService],
        exports: [jwt_1.JwtModule, jwt_http_guard_1.JwtHttpGuard, jwt_ws_guard_1.JwtWsGuard, shared_auth_service_1.SharedAuthService],
    })
], SharedJwtModule);


/***/ },

/***/ "./libs/shared/src/auth/shared-auth.service.ts"
/*!*****************************************************!*\
  !*** ./libs/shared/src/auth/shared-auth.service.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedAuthService = void 0;
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let SharedAuthService = class SharedAuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async verifyWsHandshake(request) {
        if (!request || !request.headers.cookie) {
            throw new common_1.UnauthorizedException('Cookie is missing.');
        }
        const token = this.getCookieValue(request.headers.cookie, 'access_token');
        if (!token) {
            throw new common_1.UnauthorizedException('Missing JWT');
        }
        try {
            return await this.jwtService.verifyAsync(token);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid JWT');
        }
    }
    getCookieValue(cookieHeader, cookieName) {
        if (!cookieHeader) {
            return undefined;
        }
        const prefix = `${cookieName}=`;
        for (const item of cookieHeader.split(';')) {
            const trimmed = item.trim();
            if (trimmed.startsWith(prefix)) {
                return trimmed.slice(prefix.length);
            }
        }
        return undefined;
    }
};
exports.SharedAuthService = SharedAuthService;
exports.SharedAuthService = SharedAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], SharedAuthService);


/***/ },

/***/ "./libs/shared/src/health/health.controller.ts"
/*!*****************************************************!*\
  !*** ./libs/shared/src/health/health.controller.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let HealthController = class HealthController {
    checkHealth() {
        return { status: 'ok' };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "checkHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health')
], HealthController);


/***/ },

/***/ "./libs/shared/src/health/health.module.ts"
/*!*************************************************!*\
  !*** ./libs/shared/src/health/health.module.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const health_controller_1 = __webpack_require__(/*! ./health.controller */ "./libs/shared/src/health/health.controller.ts");
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
        providers: [],
        exports: [],
    })
], HealthModule);


/***/ },

/***/ "./libs/shared/src/utils/secret.utils.ts"
/*!***********************************************!*\
  !*** ./libs/shared/src/utils/secret.utils.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSecret = getSecret;
const fs_1 = __webpack_require__(/*! fs */ "fs");
function getSecret(name) {
    const secretPath = `/run/secrets/${name}`;
    console.log('name', name);
    if ((0, fs_1.existsSync)(secretPath)) {
        return (0, fs_1.readFileSync)(secretPath, 'utf8').trim();
    }
    return process.env[name];
}


/***/ },

/***/ "@nestjs/common"
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/common");

/***/ },

/***/ "@nestjs/config"
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/config");

/***/ },

/***/ "@nestjs/core"
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
(module) {

module.exports = require("@nestjs/core");

/***/ },

/***/ "@nestjs/event-emitter"
/*!****************************************!*\
  !*** external "@nestjs/event-emitter" ***!
  \****************************************/
(module) {

module.exports = require("@nestjs/event-emitter");

/***/ },

/***/ "@nestjs/jwt"
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
(module) {

module.exports = require("@nestjs/jwt");

/***/ },

/***/ "@nestjs/platform-ws"
/*!**************************************!*\
  !*** external "@nestjs/platform-ws" ***!
  \**************************************/
(module) {

module.exports = require("@nestjs/platform-ws");

/***/ },

/***/ "@nestjs/websockets"
/*!*************************************!*\
  !*** external "@nestjs/websockets" ***!
  \*************************************/
(module) {

module.exports = require("@nestjs/websockets");

/***/ },

/***/ "cookie-parser"
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
(module) {

module.exports = require("cookie-parser");

/***/ },

/***/ "ws"
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
(module) {

module.exports = require("ws");

/***/ },

/***/ "crypto"
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
(module) {

module.exports = require("crypto");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

module.exports = require("fs");

/***/ },

/***/ "http"
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
(module) {

module.exports = require("http");

/***/ },

/***/ "url"
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
(module) {

module.exports = require("url");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./apps/chat-service/src/main.ts");
/******/ 	
/******/ })()
;