import React, { useState, useEffect, useRef } from 'react';
import './YTvideos.css';
import { PlayCircle } from 'lucide-react';

const YTvivdeos = () => {
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (showPlayer) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showPlayer]);

  const videos = [
    { id: '1ExUqzTWwec', title: 'Elliot Herzog', thumbnailUrl: 'https://img.youtube.com/vi/1ExUqzTWwec/hqdefault.jpg', description: "So Now You Win Contest" },
    { id: 'ktK-s2THCdY', title: 'Franko', thumbnailUrl: 'https://img.youtube.com/vi/ktK-s2THCdY/hqdefault.jpg', description: "So Now You Win Contest" },
    { id: 'FqfDyZBJ0aA', title: 'Brent Powel', thumbnailUrl: 'https://img.youtube.com/vi/FqfDyZBJ0aA/hqdefault.jpg', description: "So Now You Win Contest" },
    { id: 'ItLCFAmZsEs', title: 'Chandler Walton', thumbnailUrl: 'https://img.youtube.com/vi/ItLCFAmZsEs/hqdefault.jpg', description: "So Now You Win Contest" },
    { id: 'e4NQLvs223o', title: 'Elliot Herzog', thumbnailUrl: 'https://img.youtube.com/vi/e4NQLvs223o/hqdefault.jpg', description: 'So Now You Win Contest Winner.' }
  ];

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') current.scrollLeft -= 300;
    else current.scrollLeft += 300;
  };

  const handleThumbnailClick = (videoId) => {
    setSelectedVideoId(videoId);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setSelectedVideoId(null);
    setShowPlayer(false);
  };

  return (
    <div className="app-container">
      <h1 className="main-title">Highlighted Videos</h1>
      
      <div className="carousel-container">
        <button className="scroll-button left" onClick={() => scroll('left')}>&#10094;</button>
        
        <div className="carousel" ref={scrollRef}>
          {videos.map((video) => (
            <div key={video.id} className="thumbnail-card" onClick={() => handleThumbnailClick(video.id)}>
              <div className="thumbnail-wrapper">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="thumbnail-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/480x360/333333/FFFFFF?text=Video+Thumbnail`;
                  }}
                />
                <div className="play-icon-overlay">
                  <PlayCircle size={48} color="white" strokeWidth={1.5} />
                </div>
              </div>
              <div className="thumbnail-title">
                <h2>{video.title}</h2>
                <p className="thumbnail-description">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="scroll-button right" onClick={() => scroll('right')}>&#10095;</button>
      </div>

      {showPlayer && selectedVideoId && (
        <div className="video-overlay">
          <div className="video-player-container">
            <iframe
              className="video-iframe"
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button onClick={handleClosePlayer} className="close-button" aria-label="Close video player">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YTvivdeos;
