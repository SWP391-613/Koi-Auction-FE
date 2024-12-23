import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import axios from "axios";
import { format } from "date-fns";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { default as React, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { useAuth } from "~/contexts/AuthContext";
import { KoiInAuctionDetailModel } from "~/types/kois.type";
import { BreedersResponse } from "~/types/paginated.types";
import { generateBlogPostsPreview } from "~/utils/data/blog.data";
import FancyButton from "../../components/shared/FancyButton";
import Kois from "../kois/Kois";
import { getKoiInAuctionData } from "~/apis/koi.apis";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [randomKois, setRandomKois] = useState<KoiInAuctionDetailModel[]>([]);
  const [koiBreeders, setKoiBreeders] = useState<BreedersResponse>({
    total_page: 0,
    total_item: 0,
    item: [],
  });
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
        if (response) {
          console.log("API Response:", response);
          setRandomKois(response.item || []);
        }
      } catch (error) {
        console.error("Error fetching kois:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllBreeders = async () => {
      try {
        const response = await axios.get(`${DYNAMIC_API_URL}/breeders`, {
          params: {
            page: 0,
            limit: 20,
          },
        });
        setKoiBreeders(response.data || []);
      } catch (error) {
        console.error("Error fetching breeders:", error);
      }
    };

    fetchRandomKois();
    fetchAllBreeders();
  }, []);

  const handleBreederClick = (breederId: number) => {
    navigate(`/breeder/${breederId}/info`);
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
      <motion.div
        ref={featuredRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isFeaturedInView ? 1 : 0,
          y: isFeaturedInView ? 0 : 50,
        }}
        transition={{ duration: 0.6 }}
        className="bg-white"
      >
        <div className="container mx-auto">
          <Kois />
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
            {koiBreeders?.item?.length > 0 &&
              koiBreeders.item.map((breeder, index) => (
                <motion.div
                  key={`${breeder.id}-${index}`}
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
                    alt={`${breeder.first_name} logo`}
                    className="h-20 w-auto object-contain mb-2"
                  />
                  <p className="text-center font-medium text-gray-700">
                    {breeder.first_name}
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
