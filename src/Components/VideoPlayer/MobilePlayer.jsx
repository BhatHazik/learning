const MobileVideoPlayer = ({ videoUrl, videoType, className = "" }) => {
  // console.log(videoType)
    const extractYouTubeId = (url) => {
      const videoIdMatch = url?.match(
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
      );
      return videoIdMatch ? videoIdMatch[1] : url;
    };
    // console.log(className)
  
    let content;
  
    if (videoType === "youtube") {
      const videoId = extractYouTubeId(videoUrl);
      content = (
        <div className="ratio ratio-16x9" style={{ maxHeight: '250px' }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={className}
          ></iframe>
        </div>
      );
    } else if (videoType === "vimeo") {
      content = (
        <div className="ratio ratio-16x9" style={{ maxHeight: '250px' }}>
          <iframe
            src={`https://player.vimeo.com/video/${videoUrl}`}
            title="Vimeo video player"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            className={className}
            allowFullScreen
          ></iframe>
        </div>
      );
    } else if (videoType === "local") {
      console.log(videoUrl)
      content = (
        <div className="ratio ratio-16x9" style={{ maxHeight: '250px' }}>
          <video 
            controls 
            controlsList="nodownload" 
            onContextMenu={(e) => e.preventDefault()} 
            className={className}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else {
      content = (
        <div className="ratio ratio-16x9" style={{ maxHeight: '250px' }}>
          <video
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className={className}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  
    return <div className="video-player w-100 p-0 mobile-video">{content}</div>;
  };
  
  export default MobileVideoPlayer;