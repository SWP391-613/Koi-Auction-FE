import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { format } from "date-fns";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { default as React, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import KoiInAuctionSearchComponent from "~/components/search/KoiInAuctionSearchComponent";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useAuth } from "~/contexts/AuthContext";
import useBreeders from "~/hooks/useBreeders";
import { generateBlogPostsPreview } from "~/utils/data/blog.data";
import FancyButton from "../../components/shared/FancyButton";

const heroTextVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
  };
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const { data: koiBreeders, isLoading, error } = useBreeders();

  const handleBreederClick = (breederId: number) => {
    navigate(`/breeder/${breederId}/info`);
  };

  const myVideo = cld.video("background_dbkstv").quality("auto").format("auto");

  if (isLoading) return <LoadingComponent />;
  if (error) return <div>Error</div>;

  return (
    <div>
      <div className="relative min-h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
          initial={false}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent z-10" />
          <AdvancedVideo
            cldVid={myVideo}
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
          />
        </motion.div>

        {/* Main Content */}
        <div className="relative z-20 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-screen items-center">
            {/* Left Content */}
            <motion.div
              className="pt-20 lg:pt-0"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2, // Mỗi element sẽ hiện sau element trước 0.2s
                  },
                },
              }}
            >
              <motion.h2
                variants={heroTextVariants}
                className="text-red-600 text-2xl mb-4"
              >
                Welcome to Koi Auction
              </motion.h2>

              <motion.h1
                variants={heroTextVariants}
                className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              >
                Your Direct Connection To The
                <br />
                Top{" "}
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="text-red-600"
                >
                  Japanese
                </motion.span>{" "}
                Koi Breeders
              </motion.h1>

              <motion.p variants={heroTextVariants} className="text-white mb-8">
                We are always pioneering in applying information technology to
                auction activities.
              </motion.p>

              {/* Buttons section */}
              <motion.div
                variants={buttonVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                {!isLoggedIn && (
                  <motion.div whileHover="hover" variants={buttonVariants}>
                    <FancyButton
                      text="Join Now"
                      hoverText="Join Now"
                      to="/auth"
                      className="w-[80%] sm:w-[80%] md:w-full lg:w-full"
                    />
                  </motion.div>
                )}
                <motion.div whileHover="hover" variants={buttonVariants}>
                  <FancyButton
                    text="View Auction"
                    hoverText="Bid Now"
                    to="/auctions"
                    className="w-[80%] sm:w-[80%] md:w-full"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Kois Section */}
      <motion.div transition={{ duration: 0.6 }} className="bg-white">
        <div className="container mx-auto">
          <KoiInAuctionSearchComponent
            onSearchStateChange={handleSearchStateChange}
          />
        </div>
      </motion.div>

      {/* Partner Breeders section */}
      <div className="py-4 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900">
              <span className="text-red-600">→</span>
              Our Partner Breeders
              <span className="text-red-600">←</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {koiBreeders &&
              koiBreeders.length > 0 &&
              koiBreeders.map((breeder, index) => (
                <div
                  className="bg-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => handleBreederClick(breeder.user_response.id)}
                >
                  <img
                    src={breeder.user_response.avatar_url}
                    alt={`${breeder.user_response.first_name} logo`}
                    className="h-20 w-auto object-contain mb-2"
                  />
                  <p className="text-center font-medium text-gray-700">
                    {breeder.user_response.first_name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900">
              <span className="text-red-600">→</span>
              Latest News & Updates
              <span className="text-red-600">←</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generateBlogPostsPreview(8).map((post, index) => (
              <>
                <Link
                  to={`/blog/${post.id}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {/* Date Badge */}
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                      {format(post.date, "dd/MM/yyyy")}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/blog"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 hover:underline transition-all duration-300 inline-block"
            >
              See more news
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
