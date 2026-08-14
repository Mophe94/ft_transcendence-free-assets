import { Injectable } from '@nestjs/common';

interface Connection {
  socketId: string;
  connectedAt: Date;
}
@Injectable()
export class ChatService {
  private onlineUsers = new Map<string, Connection[]>();

  addConnection(userId: string, socketId: string) {
    const currentConnections = this.onlineUsers.get(userId) || [];
    currentConnections.push({ socketId, connectedAt: new Date() });
    this.onlineUsers.set(userId, currentConnections);
  }
  removeConnection(userId: string, socketId: string) {
    const connections = this.onlineUsers.get(userId);
    if (!connections) return;
    const remainingConnections = connections.filter(
      (conn) => conn.socketId !== socketId,
    );

    if (remainingConnections.length > 0) {
      this.onlineUsers.set(userId, remainingConnections);
    } else {
      this.onlineUsers.delete(userId);
    }
  }

  isOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  getOnlineUsersIds(): string[] {
    return Array.from(this.onlineUsers.keys());
  }
}
