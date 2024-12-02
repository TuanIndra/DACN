import React from 'react';

const MediaDisplay = ({ mediaList, onMediaClick }) => {
  const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some((ext) => url.endsWith(ext));
  };

  if (!mediaList || mediaList.length === 0) return null;

  if (mediaList.length === 1) {
    // Hiển thị full khi chỉ có 1 ảnh hoặc video
    const media = mediaList[0];
    return (
      <div className="mt-2">
        {isVideo(media.url) ? (
          <video
            controls
            src={`http://localhost:8082/uploads/${media.url}`}
            className="w-full h-auto object-cover cursor-pointer"
          />
        ) : (
          <img
            src={`http://localhost:8082/uploads/${media.url}`}
            alt="Single Media"
            className="w-full h-auto object-cover cursor-pointer"
            onClick={() => onMediaClick(0)}
          />
        )}
      </div>
    );
  }

  // Hiển thị lưới khi có nhiều ảnh hoặc video
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {mediaList.slice(0, 4).map((media, index) => (
        <div key={media.id} className="relative">
          <div className="w-full h-[150px] md:h-[200px] overflow-hidden rounded">
            {isVideo(media.url) ? (
              <video
                controls
                src={`http://localhost:8082/uploads/${media.url}`}
                className="w-full h-full object-cover cursor-pointer"
              />
            ) : (
              <img
                src={`http://localhost:8082/uploads/${media.url}`}
                alt={`Media ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onMediaClick(index)}
              />
            )}
            {index === 3 && mediaList.length > 4 && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold"
                onClick={() => onMediaClick(index)}
              >
                +{mediaList.length - 4}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaDisplay;
