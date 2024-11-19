import React from "react";
import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

// Create Cloudinary instance outside component to prevent re-creation
const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUD_NAME,
  },
});

// Create video configuration outside component
const myVideo = cld.video("background_dbkstv").quality("auto").format("auto");

const VideoBackground = React.memo(() => {
  return (
    <div className="video-container fixed top-0 left-0 w-full h-full -z-10">
      <AdvancedVideo
        cldVid={myVideo}
        autoPlay
        muted
        loop
        className="w-full h-full object-cover"
      />
    </div>
  );
});

// Add display name for debugging
VideoBackground.displayName = "VideoBackground";

export default VideoBackground;
