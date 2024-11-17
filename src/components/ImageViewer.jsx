import React, { useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './ImageViewer.css';

const ImageViewer = ({ images }) => {
  const rotationState = useRef(new Map());

  useEffect(() => {
    console.log('Images received in ImageViewer:', images);
  }, [images]);

  const rotateImage = (id, angle) => {
    const currentRotation = rotationState.current.get(id) || 0;
    const newRotation = (currentRotation + angle) % 360;
    rotationState.current.set(id, newRotation);
    
    const img = document.getElementById(`image-${id}`);
    if (img) {
      img.style.transform = `rotate(${newRotation}deg)`;
    }
  };

  const resetImage = (id) => {
    const img = document.getElementById(`image-${id}`);
    if (img) {
      rotationState.current.set(id, 0);
      img.style.transform = 'rotate(0deg)';
    }
  };

  const handleImageError = (e) => {
    console.error('Failed to load image:', e.target.src);
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGMEYwRjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
  };

  if (!images || (!images.main && !images.age && !images.signature)) {
    return (
      <div className="no-images-message">
        No images available for this appraisal.
      </div>
    );
  }

  const renderImage = (src, alt, label, id) => {
    if (!src) return null;

    return (
      <div key={id} className="image-wrapper">
        <div className="image-label">{label}</div>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={5}
          centerOnInit={true}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent>
                <img
                  src={src}
                  alt={alt}
                  id={`image-${id}`}
                  onError={handleImageError}
                />
              </TransformComponent>
              <div className="image-controls">
                <button
                  className="control-button"
                  onClick={() => rotateImage(id, -90)}
                  title="Rotate Left"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2.5 12a9.5 9.5 0 1 1 3.5 7.5M2.5 12V5m0 7h7" />
                  </svg>
                </button>
                <button
                  className="control-button"
                  onClick={() => rotateImage(id, 90)}
                  title="Rotate Right"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 12a9.5 9.5 0 1 0-3.5 7.5M21.5 12V5m0 7h-7" />
                  </svg>
                </button>
                <button
                  className="control-button"
                  onClick={zoomIn}
                  title="Zoom In"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </button>
                <button
                  className="control-button"
                  onClick={zoomOut}
                  title="Zoom Out"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6" />
                  </svg>
                </button>
                <button
                  className="control-button reset"
                  onClick={() => {
                    resetTransform();
                    resetImage(id);
                  }}
                  title="Reset Image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-9 9z" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </TransformWrapper>
      </div>
    );
  };

  return (
    <div className="images-container">
      {images.main && renderImage(images.main, 'Main Image', 'Main Image', 'main')}
      {images.age && renderImage(images.age, 'Age Image', 'Age Image', 'age')}
      {images.signature && renderImage(images.signature, 'Signature Image', 'Signature Image', 'signature')}
    </div>
  );
};

export default ImageViewer;