import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import FancyButton from "../../components/shared/FancyButton";
import { koiBreeders } from "../../utils/data/koibreeders";
import imageBackground from "../../assets/imageBackground.jpg";
import { generateBlogPostsPreview } from "~/utils/data/blog.data";
import { format } from "date-fns";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleBreederClick = (breederId: number) => {
    navigate(`/breeder/${breederId}/info`);
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
            <div className="pt-20 lg:pt-0">
              <h2 className="text-red-600 text-xl mb-4">
                Welcome to Koi Auction
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Your Direct Connection To The
                <br />
                Top <span className="text-orange-500">Japanese</span> Koi
                Breeders
              </h1>
              <p className="text-white mb-8 max-w-xl">
                We are always pioneering in applying information technology to
                auction activities.
              </p>

              {/* Buttons section */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!isLoggedIn && (
                  <FancyButton
                    text="Join Now"
                    hoverText="Join Now"
                    to="/register"
                    className="w-full sm:w-auto"
                  />
                )}
                <FancyButton
                  text="View Auction"
                  hoverText="Bid Now"
                  to="/auctions"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>

          </div>
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
                    {format(new Date(), 'dd/MM/yyyy')}
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
