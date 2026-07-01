import './HexMediaWindow.css';

interface MediaProps {
  type: 'img' | 'video' | 'default';
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  containerId?: string;
  mediaId?: string;
}

export function HexMediaWindow({
  type,
  src,
  alt,
  containerId,
  mediaId,
}: MediaProps) {
  let content;

  switch (type) {
    case 'img':
      content = (
        <img
          src={src}
          alt={alt || 'Image'}
          id={mediaId}
          className="hex-image"
        />
      );
      break;
    case 'video':
      content = <video src={src} controls id={mediaId} />;
      break;
    default:
      content = (
        <img
          src="assets/images/mediaNotFound.png"
          alt="Media not found"
          id={mediaId}
          className="hex-image"
        />
      );
  }
  return (
    <div className="hex-container" id={containerId}>
      <div className="hex-border">{content}</div>
    </div>
  );
}
