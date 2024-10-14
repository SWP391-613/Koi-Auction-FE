import React from "react";
import { KoiDetailModel } from "~/types/kois.type";
import { AuctionKoi } from "~/types/auctionkois.type";
import Sold from "~/assets/Sold.png";

interface MediaGalleryProps {
  koi: KoiDetailModel;
  auctionKoi: AuctionKoi;
  selectedMedia: string | null;
  setSelectedMedia: (media: string) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  koi,
  auctionKoi,
  selectedMedia,
  setSelectedMedia,
}) => {
  return (
    <>
      <div className="relative h-96 w-full rounded-xl bg-[#4086c7] sm:h-128 md:h-144 lg:h-192">
        {selectedMedia ? (
          selectedMedia.includes("youtube") ? (
            <iframe
              className="absolute inset-0 h-full w-full rounded-xl"
              src={selectedMedia}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              className="absolute inset-0 h-full w-full rounded-xl object-contain shadow-md transition duration-300 hover:shadow-2xl hover:ring-4 hover:ring-blue-400"
              src={selectedMedia}
              alt={koi.name}
            />
          )
        ) : (
          <img
            className="absolute inset-0 h-full w-full rounded-xl object-contain shadow-md transition duration-300 hover:shadow-2xl hover:ring-4 hover:ring-blue-400"
            src={koi.thumbnail}
            alt={koi.name}
          />
        )}
        {auctionKoi.is_sold && (
          <div className="absolute -left-4 -top-4 z-10">
            <img
              src={Sold}
              alt="Sold"
              className="h-[10rem] w-[10rem] transform rotate-[-20deg]"
            />
          </div>
        )}
      </div>
      <div className="mt-4 h-30 flex space-x-2 overflow-x-auto">
        <img
          src={koi.thumbnail}
          alt="Main"
          className="w-20 cursor-pointer rounded-md object-cover"
          onClick={() => setSelectedMedia(koi.thumbnail)}
        />
        {koi.additional_images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Additional ${index + 1}`}
            className="h-20 w-20 cursor-pointer rounded-md object-cover"
            onClick={() => setSelectedMedia(img)}
          />
        ))}
        <div
          className="flex w-20 cursor-pointer items-center justify-center rounded-md bg-gray-200"
          onClick={() =>
            setSelectedMedia("https://www.youtube.com/embed/your-video-id")
          }
        >
          {/* Add a play button or video icon here */}
        </div>
      </div>
    </>
  );
};

export default MediaGallery;
