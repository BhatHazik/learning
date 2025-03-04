const VideoPlayer = ({ videoUrl, videoType, className = "" }) => {

  let content;

  const extractYouTubeId = (url) => {
    const videoIdMatch = url?.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
    );
    return videoIdMatch ? videoIdMatch[1] : url;
  };

  if (videoType === "youtube") {
    const videoId = extractYouTubeId(videoUrl);
  
    content = (
      <iframe
        // width="560"
        // height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={className}
      ></iframe>
    );
  } else if (videoType === "vimeo") {
    content = (
      <iframe
        // width="560"
        // height="315"
        src={`https://player.vimeo.com/video/${videoUrl}`}
        title="Vimeo video player"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        className={className}
        allowFullScreen
      ></iframe>
    );
  } else if (videoType === "local") {
    content = (
      <video controls className={className}>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  } else {
    content = (
      <video
        // width="560"
        // height="315"
        className="tumbnail-userCourseview"
        
        controls
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return <div className="video-player text-center">{content}</div>;
};

export default VideoPlayer;
