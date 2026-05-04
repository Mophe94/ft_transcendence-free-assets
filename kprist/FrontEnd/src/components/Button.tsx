import "./Button.css"
function PlayButton () {
    return (
        <button className="play-button" onClick={gameWindow}>
            Play&nbsp;!
        </button>
    );
}

function gameWindow () {
  window.open(
    "/transcendence.html", 
    "_blank", 
    "width=980,height=640,left=200,top=100"
  );
}

export default PlayButton