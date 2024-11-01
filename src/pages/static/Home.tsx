import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import FancyButton from "../../components/shared/FancyButton";
import { koiBreeders } from "../../utils/data/koibreeders";
import imageBackground from "../../assets/imageBackground.jpg";
import { generateBlogPostsPreview } from "~/utils/data/blog.data";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { KoiDetailModel } from "~/types/kois.type";
import { getKoiData } from "~/utils/apiUtils";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [randomKois, setRandomKois] = useState<KoiDetailModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRandomKois = async () => {
      try {
        setIsLoading(true);
        const response = await getKoiData(1, 4);
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

  const FeaturedKoiCard = ({ kois }: { kois: KoiDetailModel[] }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {kois.map((koi, index) => (
          <div
            key={`${koi.id}-${index}`}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Ảnh Koi */}
            <div className="relative h-64 bg-[#4086c7] overflow-hidden">
              {koi.thumbnail ? (
                <img
                  src={koi.thumbnail}
                  alt={koi.name}
                  className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-white">No Image</span>
                </div>
              )}
            </div>

            {/* Thông tin Koi */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {koi.name}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Length</span>
                  <span className="font-semibold text-gray-800">
                    {koi.length} cm
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sex</span>
                  <span className="font-semibold text-gray-800">{koi.sex}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Age</span>
                  <span className="font-semibold text-gray-800">
                    {koi.age} years
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-800">
                    {koi.category_id}
                  </span>
                </div>
              </div>
              {/* Nút Explore với animation */}
              <button
                onClick={() => navigate(`/kois/${koi.id}`)}
                type="button"
                className="mt-6 flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
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
            </div>
          </div>
        ))}
      </div>
    );
  };

  const heroTextVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div>
      <div className="relative min-h-screen">
        {/* Background with gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent z-10" />
          <img
            src={imageBackground}
            alt="Background"
            className="object-cover w-full h-full"
          />
        </div>

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
                    staggerChildren: 0.2 // Mỗi element sẽ hiện sau element trước 0.2s
                  }
                }
              }}
            >
              <motion.h2 
                variants={heroTextVariants}
                className="text-red-600 text-xl mb-4"
              >
                Welcome to Koi Auction
              </motion.h2>
              
              <motion.h1 
                variants={heroTextVariants}
                className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              >
                Your Direct Connection To The
                <br />
                Top <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="text-orange-500"
                >
                  Japanese
                </motion.span> Koi Breeders
              </motion.h1>
              
              <motion.p 
                variants={heroTextVariants}
                className="text-white mb-8 max-w-xl"
              >
                We are always pioneering in applying information technology to auction activities.
              </motion.p>

              {/* Buttons section */}
              <motion.div 
                variants={buttonVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                {!isLoggedIn && (
                  <motion.div
                    whileHover="hover"
                    variants={buttonVariants}
                  >
                    <FancyButton
                      text="Join Now"
                      hoverText="Join Now"
                      to="/register"
                      className="w-full sm:w-auto"
                    />
                  </motion.div>
                )}
                <motion.div
                  whileHover="hover"
                  variants={buttonVariants}
                >
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
      <div className="py-16 px-4 bg-white">
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
      </div>

      <div>
        {/* Partner Breeders section */}
        <div className="py-16 px-4">
          <div className="container mx-auto">
            {/* Section Title with decorative arrows */}
            <div className="text-center mb-12">
              <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900">
                <span className="text-red-600">→</span>
                Our Partner Breeders
                <span className="text-red-600">←</span>
              </h2>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {koiBreeders.map((breeder) => (
                <div
                  key={breeder.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex items-center justify-center cursor-pointer"
                  onClick={() => handleBreederClick(breeder.id)}
                >
                  <img
                    src={breeder.avatar_url}
                    alt={`${breeder.name} logo`}
                    className="h-12 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900">
              <span className="text-red-600">→</span>
              Latest News & Updates
              <span className="text-red-600">←</span>
            </h2>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generateBlogPostsPreview(4).map((post) => (
              <Link
                key={post.id}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
