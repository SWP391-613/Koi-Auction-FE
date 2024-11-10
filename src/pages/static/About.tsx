import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-4xl space-y-8"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-black/5"
        >
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 text-center"
            >
              <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
                Welcome to Koi Auction!
              </h1>
            </motion.div>
            <div className="space-y-6 text-gray-600">
              <p className="text-lg leading-relaxed">
                Koi Auction! is proud to be your premier destination for
                Japanese Koi auctions in Vietnam. Our platform is dedicated to
                connecting Koi enthusiasts and collectors with reputable
                breeders around the country, offering an exceptional selection
                of exquisite Japanese Koi.
              </p>
              <p className="text-lg leading-relaxed">
                With a deep passion for the artistry and beauty of Koi, we have
                created an online marketplace that brings together the finest
                breeders and the most discerning buyers. Our auctions provide a
                unique opportunity for Koi enthusiasts to acquire top-quality
                fish directly from renowned breeders in Japan, all from the
                comfort of their own homes.
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-black/5"
        >
          <div className="p-8">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8 text-3xl font-bold text-gray-900"
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="space-y-8">
              {[
                { title: "How does the auction work?", delay: 0.6 },
                {
                  title: "How does shipping work and how much does it cost?",
                  delay: 0.7,
                },
                {
                  title: "What happens if my koi passes away in transit?",
                  delay: 0.8,
                },
                { title: "How does the payment work?", delay: 0.9 },
                { title: "Is there bid sniping protection?", delay: 1.0 },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: faq.delay }}
                  className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow"
                >
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">
                    {faq.title}
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p className="leading-relaxed">
                      During an auction, koi are not yet in our Company and are
                      still at the Breeder's place. Koi that are won are then
                      shipped to the company, and shipped via our transit system
                      to the Buyer.
                    </p>
                    <p className="leading-relaxed">
                      The Buyer is responsible for all shipping and handling
                      fees which are invoiced post auction. We will contact you
                      via phone or email to arrange a preferred shipping time,
                      location, and payment.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl"
        >
          <h2 className="mb-6 text-3xl font-bold">Contact Us</h2>
          <div className="space-y-4">
            <p className="flex items-center space-x-2">
              <span>Phone:</span>
              <a
                href="tel:+18658767474"
                className="hover:text-blue-200 transition-colors"
              >
                +1 (865) 876-7474
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <span>Email:</span>
              <a
                href="mailto:contact@auctionkoi.com"
                className="hover:text-blue-200 transition-colors"
              >
                contact@auctionkoi.com
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
