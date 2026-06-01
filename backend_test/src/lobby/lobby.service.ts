import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocket } from 'ws';
import { randomUUID } from 'crypto';
import { clientsMap, ClientData } from 'src/shared/clients.map';
import { FULL_LOBBY, PHASE_DURATIONS, PhaseName } from 'src/game/game.type';

@Injectable()
export class LobbyService {

	constructor(private eventEmitter: EventEmitter2) {}

	private rooms = new Map<string, Set<WebSocket>>();
	private phaseTimers = new Map<string, NodeJS.Timeout>()

	// JOIN LOBBY
	joinLobby(client: WebSocket, user: ClientData['user']) : void {
		const roomId = this.findAvailableRoom() ?? this.createRoom();
		const clients = this.rooms.get(roomId)!;

		clients.add(client);

		const clientData = clientsMap.get(client);
		if (clientData)
			clientData.roomId = roomId;
		console.log(`[LobbyService] User ${user.sub} joined room ${roomId} (${clients.size}/${FULL_LOBBY})`)

/* 		this.broadcast(clients, {
			event : 'lobby',
			state : 'player_joined',
			data : { roomId, playerCount: clients.size, maxPlayers: FULL_LOBBY } //See what is needed
		}); */

		this.eventEmitter.emit('lobby.player_joined', {
			clients, 
			roomId, 
			playerCount: clients.size
		});

		if (clients.size === FULL_LOBBY) {
			this.clearPhaseTimer(roomId);
			this.eventEmitter.emit('lobby.start', { roomId, clients });
		}
		else if (clients.size === 1) {
			this.startPhaseTimer(roomId, 'lobby', () => {
			console.log(`[LobbyService] Room ${roomId} lobby timeout`)
			//ADD bots ??
			this.eventEmitter.emit('lobby.start', { roomId, clients });
			});
		}
	}

	// LOBBY HELPERS
	private findAvailableRoom(): string | null {
	for (const [roomId, clients] of this.rooms) {
		if (clients.size < FULL_LOBBY)
		return roomId;
	}
	return null;
	}

	private createRoom(): string {
	const roomId = randomUUID();
	this.rooms.set(roomId, new Set());
	console.log(`[LobbyService] Room created: ${roomId}`)
	return roomId;
	}

	leaveRoom(client: WebSocket, roomId: string): void {
	const clients = this.rooms.get(roomId);
	if (!clients)
		return
	clients.delete(client);
	console.log(`Client left ${roomId}, ${clients.size} players remaining`);

	if (clients.size === 0 ) {
		this.clearPhaseTimer(roomId);
		this.rooms.delete(roomId);
		console.log(`Room ${roomId} deleted (empty)`)
	}
	}

	getRoom(roomId: string) : Set<WebSocket> | undefined {
		return this.rooms.get(roomId);
	}

	// PHASE TIMERS
	startPhaseTimer(roomId: string, phase: PhaseName, onTimeout: () => void) : void {
		this.clearPhaseTimer(roomId);
		const duration = PHASE_DURATIONS[phase];
		this.phaseTimers.set(roomId, setTimeout(onTimeout, duration * 1000));
	  }
	
	private clearPhaseTimer(roomId: string): void {
		const handle = this.phaseTimers.get(roomId);
		if (handle) {
		  clearTimeout(handle);
		  this.phaseTimers.delete(roomId);
		}
	  }
}


