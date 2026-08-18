import { useCallback, useRef, useState, type ReactNode } from "react";
import { LobbySocketContext, type LobbyPlayer } from "./LobbySocketContext";

export function LobbySocketProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [roomCapacity, setRoomCapacity] = useState(0);
  const [timer, setTimer] = useState(0);
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const connect = useCallback(
    (
      action: 'create_room' | 'quick_pairing' | 'join_room',
      username: string,
      skin: string,
      targetRoomId?: string,
    ) => {
      if (wsRef.current, !username) return;

      setIsConnecting(true);
      setJoinError(null);
      const ws = new WebSocket(`${import.meta.env.VITE_LOBBY_SERVICE}`);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify(
            action === 'join_room'
              ? { event: action, data: { roomId: targetRoomId, username, skin } }
              : { event: action, data: { username, skin } },
          ),
        );
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.event === 'lobby') {
          if (msg.state === 'room_assigned') {
            setRoomId(msg.data.roomId);
            setIsConnecting(false);
          }
          if (msg.state === 'player_joined') {
            setPlayerCount(msg.data.playerCount);
            setRoomCapacity(msg.data.roomCapacity);
            setTimer(msg.data.timer);
            setPlayers(msg.data.players);
          }
          if (msg.state === 'join_failed') {
            setJoinError(msg.data.reason);
            setIsConnecting(false);
            ws.close();
          }
        }

        if (msg.event === 'game') {
          setGameStarted(true);
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
      };
    },
    [],
  );

  const createRoom = useCallback(
    (username: string, skin: string) => connect('create_room', username, skin),
    [connect],
  );
  const quickPairing = useCallback(
    (username: string, skin: string) => connect('quick_pairing', username, skin),
    [connect],
  );
  const joinRoom = useCallback(
    (targetRoomId: string, username: string, skin: string) =>
      connect('join_room', username, skin, targetRoomId),
    [connect],
  );

  const reset = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setRoomId(null);
    setPlayerCount(0);
    setRoomCapacity(0);
    setTimer(0);
    setPlayers([]);
    setGameStarted(false);
    setIsConnecting(false);
    setJoinError(null);
  }, []);

  return (
    <LobbySocketContext.Provider
      value={{
        roomId,
        playerCount,
        roomCapacity,
        timer,
        players,
        gameStarted,
        isConnecting,
        joinError,
        createRoom,
        quickPairing,
        joinRoom,
        reset,
      }}
    >
      {children}
    </LobbySocketContext.Provider>
  );
}