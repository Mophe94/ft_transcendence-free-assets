import "./RectMediaWindow.css"

interface MediaProps {
    type: "img" | "video" | "default";
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    containerId?: string;
    mediaId?: string;
}

export function RectMediaWindow({ 
    type, 
    src, 
    alt,
    width = "100%",
    height = "auto",
    containerId,
    mediaId,
}: MediaProps) {
    const mediaStyle = {
        width: width,
        height: height,
        maxWidth: "100%",
        objectFit: "cover" as const
    };
    let content;

    switch (type) {
        case "img":
            content = (
                <img 
                    src={src} 
                    style={mediaStyle}
                    alt={alt || "Image"} 
                    id = {mediaId}
                />
            );
            break;
        case "video":
            content = (
                <video 
                    src={src}
                    style={mediaStyle}
                    controls
                    id = {mediaId}
                />
            );
            break;
        default:
            content = (
                    <img 
                        src="assets/images/mediaNotFound.png" 
                        style={mediaStyle}
                        alt="Media not found"
                        id = {mediaId}
                    />
            );
    }
    return <div className="media-content" id={containerId}>
                {content}
            </div>
}