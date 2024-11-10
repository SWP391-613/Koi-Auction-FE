import React from "react";
import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

const VideoBackground = () => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
  });

  const myVideo = cld.video("background_dbkstv").quality("auto").format("auto");

  return (
    <div className="video-container">
      <AdvancedVideo
        cldVid={myVideo}
        autoPlay
        muted
        loop
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default VideoBackground;
