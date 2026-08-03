import GameRoom from "../content/GameRoom";


export default function Test() {
  return (
    <>
      <GameRoom {...{ roomName: "Test-room", players: ["kprist", "stempels", "bertrmar", "agaland"], size_game: 4, endTime: 1785247132000 } } />
    </>
  );
}