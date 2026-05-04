import "./TextWindow.css"
interface windowText {
    title: string,
    content?: string,
    containerId?: string
}

function TextWindow(props: windowText) {
    return (
        <div className="text-content" id={props.containerId}>
            <h1>{props.title}</h1>
            {props.content && <p>{props.content}</p>}
        </div>
    )
}

export default TextWindow