import { createContext, useContext } from "react";

export interface LobbyPlayer {
  username: string;
  skin: string;
  isBot: boolean;
}

interface LobbySocketState {
  roomId: string | null;
  playerCount: number;
  roomCapacity: number;
  timer: number;
  players: LobbyPlayer[];
  gameStarted: boolean;
  isConnecting: boolean;
  joinError: string | null;
  createRoom: (username: string, skin: string) => void;
  quickPairing: (username: string, skin: string) => void;
  joinRoom: (targetRoomId: string, username: string, skin: string) => void;
  reset: () => void;
}

export const LobbySocketContext = createContext<LobbySocketState | null>(null);



export function useLobbySocket() {
  const ctx = useContext(LobbySocketContext);
  if (!ctx) throw new Error('useLobbySocket must be used within LobbySocketProvider');
  return ctx;
}
