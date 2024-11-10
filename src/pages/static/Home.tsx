import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { format } from "date-fns";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { default as React, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import KoiSearchGrid from "~/components/shared/KoiSearchGrid";
import { useAuth } from "~/contexts/AuthContext";
import { KoiInAuctionDetailModel } from "~/types/kois.type";
import { getKoiInAuctionData } from "~/utils/apiUtils";
import { generateBlogPostsPreview } from "~/utils/data/blog.data";
import FancyButton from "../../components/shared/FancyButton";
import { koiBreeders } from "../../utils/data/koibreeders";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [randomKois, setRandomKois] = useState<KoiInAuctionDetailModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Add refs for scroll sections
  const featuredRef = useRef(null);
  const breedersRef = useRef(null);
  const newsRef = useRef(null);

  // Check if sections are in view
  const isFeaturedInView = useInView(featuredRef, {
    once: true,
    margin: "-100px",
  });
  const isBreedersInView = useInView(breedersRef, {
    once: true,
    margin: "-100px",
  });
  const isNewsInView = useInView(newsRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchRandomKois = async () => {
      try {
        setIsLoading(true);
        const response = await getKoiInAuctionData("", 1, 12);
        console.log("API Response:", response);
        setRandomKois(response.item || []);
      } catch (error) {
        console.error("Error fetching kois:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRandomKois();
  }, []);

  const handleBreederClick = (breederId: number) => {
    navigate(`/breeder/${breederId}/info`);
  };

  const FeaturedKoiCard = ({ kois }: { kois: KoiInAuctionDetailModel[] }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
      <KoiSearchGrid
        kois={kois}
        getLinkUrl={(koi) => `/auctions/${koi.auction_id}`}
        buttonEffect={(koi) => (
          <button
            onClick={() => navigate(`/auctions/${koi.auction_id}`)}
            type="button"
            className="mt-6 flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-blue-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
          >
            Explore
            <svg
              className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
              viewBox="0 0 16 19"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                className="fill-gray-800 group-hover:fill-gray-800"
              ></path>
            </svg>
          </button>
        )}
      />
    );
  };

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

  const myVideo = cld.video("background_dbkstv").quality("auto").format("auto");

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
                      className="w-full sm:w-auto"
                    />
                  </motion.div>
                )}
                <motion.div whileHover="hover" variants={buttonVariants}>
                  <FancyButton
                    text="View Auction"
                    hoverText="Bid Now"
                    to="/auctions"
                    className="w-full sm:w-auto"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Kois Section */}
      <motion.div
        ref={featuredRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isFeaturedInView ? 1 : 0,
          y: isFeaturedInView ? 0 : 50,
        }}
        transition={{ duration: 0.6 }}
        className="py-16 px-4 bg-white"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900">
              <span className="text-red-600">→</span>
              Featured Kois
              <span className="text-red-600">←</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : randomKois && randomKois.length > 0 ? (
            <FeaturedKoiCard kois={randomKois} />
          ) : (
            <div className="text-center text-gray-500">
              No kois available at the moment
            </div>
          )}
        </div>
      </motion.div>

      {/* Partner Breeders section */}
      <motion.div
        ref={breedersRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isBreedersInView ? 1 : 0,
          y: isBreedersInView ? 0 : 50,
        }}
        transition={{ duration: 0.6 }}
        className="py-4 px-4"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900">
              <span className="text-red-600">→</span>
              Our Partner Breeders
              <span className="text-red-600">←</span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isBreedersInView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4"
          >
            {koiBreeders.map((breeder, index) => (
              <motion.div
                key={breeder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isBreedersInView ? 1 : 0,
                  y: isBreedersInView ? 0 : 20,
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => handleBreederClick(breeder.id)}
              >
                <img
                  src={breeder.avatar_url}
                  alt={`${breeder.name} logo`}
                  className="h-20 w-auto object-contain mb-2"
                />
                <p className="text-center font-medium text-gray-700">
                  {breeder.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* News Section */}
      <motion.div
        ref={newsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isNewsInView ? 1 : 0, y: isNewsInView ? 0 : 50 }}
        transition={{ duration: 0.6 }}
        className="py-8 px-4"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900">
              <span className="text-red-600">→</span>
              Latest News & Updates
              <span className="text-red-600">←</span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isNewsInView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {generateBlogPostsPreview(8).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isNewsInView ? 1 : 0,
                  y: isNewsInView ? 0 : 20,
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
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
                      {format(new Date(), "dd/MM/yyyy")}
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
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isNewsInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-8"
          >
            <Link
              to="/blog"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 hover:underline transition-all duration-300 inline-block"
            >
              See more news
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
