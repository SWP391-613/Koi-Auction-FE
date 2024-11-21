import React from "react";
import { motion } from "framer-motion";

const Terms: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const sections = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing and using fkoi88.me, you acknowledge and agree to comply with these Terms and Conditions. These Terms apply to all users and govern the use of our platform and services, including koi auction services. If you do not agree with these Terms, we kindly request you discontinue the use of our Site and services.",
    },
    {
      title: "Member Registration",
      content:
        "To access certain features of the platform and participate in koi auctions, you are required to register an account with fkoi88.me. By registering, you affirm that the information provided is accurate and truthful and agree to keep your account details up to date.",
    },
    {
      title: "Breeder Registration",
      content:
        "To register as a breeder, you must provide your name, contact information, and a detailed description of your koi breeding practices. For additional assistance, please contact us at contact@fkoi88.me. By registering, you agree to provide accurate information about your koi and adhere to all relevant legal and regulatory requirements. We will respond to your registration request within seven business days.",
    },
    {
      title: "Koi Registration for Auction",
      content:
        "To list a koi for auction, you must submit a detailed description, including its appearance, size, and other pertinent information. You agree to provide accurate and truthful details and comply with all applicable laws and regulations. A service fee of 10% of the koi's base price will be retained by our platform.",
    },
    {
      title: "Compliance with Applicable Laws",
      content:
        "As our services extend across various provinces in Vietnam, it is your responsibility to ensure full compliance with all relevant local, state, and national laws when using our platform.",
    },
    {
      title: "Bidding and Auction Terms",
      content:
        "1. The bidding feature is available exclusively to registered members. By placing a bid, you agree to honor the bid amount if you win the auction. Bids cannot be retracted or canceled once submitted.\n" +
        "2. Breeder accounts are designated solely for selling koi and are not permitted to participate in bidding.\n" +
        "3. All bids are considered final and binding. If you win an auction, you are obligated to complete the payment as outlined in our payment terms.\n" +
        "4. Except for the winner of the auction, all other bidders will have their bid amounts refunded to their account balance within 24 hours of the auction's close.",
    },
    {
      title: "Auction Methods",
      content:
        "1. Ascending Bid Method: Members may bid multiple times, and the highest bidder at the auction's close or the first to meet or exceed the ceiling price will be declared the winner.\n" +
        "2. Descending Bid Method: Auctions start at a ceiling price, which decreases at fixed intervals (e.g., every five minutes). The first bid placed wins the auction.\n" +
        "3. Fixed Bid Method: The koi is offered at a fixed price, and the first person to place a bid wins the auction.",
    },
    {
      title: "Order Agreement",
      content:
        "The system will automatically generate an order for the winning koi based on the winner's information. If the winner does not confirm the order and provide necessary details within 72 hours, the order will be canceled, and the bid amount will not be refunded to the winner's account balance.",
    },
    {
      title: "Payment Terms",
      content:
        "Payments for koi won at auction must be made within 72 hours of winning. Failure to complete payment within this timeframe may result in cancellation of the transaction, and the koi may no longer be available for shipment.",
    },
    {
      title: "Shipping and Delivery",
      content:
        "Koi purchased through fkoi88.me will be shipped in alignment with the breeder's best practices and quarantine protocols. While we strive to ensure safe and timely delivery, we cannot guarantee the koi's survival during shipping from the breeder's facility or our facility to the buyer.",
    },
    {
      title: "Refund Policy",
      content:
        "1. For Bidders: If your koi dies during shipping to your location, you will receive a full refund (including the koi price and shipping fee) to your account balance.\n" +
        "2. For Breeders: If your koi dies during shipping from our facility to the buyer, you will be refunded the cost of the koi (including the base price and shipping fee) to your account balance.",
    },
    {
      title: "Disclaimer of Warranties",
      content:
        "1. For Bidders: In cases where the order is canceled due to unavailability of delivery (e.g., shipper is unreachable), refunds will not be issued to the bidder's account balance.\n" +
        "2. For Breeders: In cases where the koi dies during shipping from our facility to the buyer, fkoi88.me will not be held responsible for the loss.",
    },
    {
      title: "Indemnification",
      content:
        "You agree to indemnify and hold fkoi88.me, its affiliates, and their respective employees, officers, and agents harmless against any claims, losses, or damages arising from your breach of these Terms or your use of the platform and its services.",
    },
    {
      title: "Governing Law and Jurisdiction",
      content:
        "These Terms are governed by the laws of Vietnam. Any disputes arising in connection with these Terms, the platform, or its services will be resolved in a court of competent jurisdiction within Vietnam.",
    },
    {
      title: "Modifications to Terms",
      content:
        "We reserve the right to amend these Terms at any time. Your continued use of the platform signifies your acceptance of any updates or modifications to these Terms.",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto max-w-4xl space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header Section */}
        <motion.div
          className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl ring-1 ring-black/5"
          {...fadeIn}
        >
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent text-center">
            Terms of Service Agreement
          </h1>
          <p className="mt-4 text-center text-gray-600">
            Last updated: November 08, 2024
          </p>
        </motion.div>

        {/* Terms Sections */}
        <motion.div
          className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl ring-1 ring-black/5"
          {...fadeIn}
        >
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-black mb-3">
                      {section.title}
                    </h2>
                    {section.content.split("\n").map((line, index) => (
                      <p
                        key={index}
                        className="text-gray-900 text-lg leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.section>
            ))}

            {/* Contact Section */}
            <motion.section
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: sections.length * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                    11
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Contact Us
                  </h2>
                  <p className="text-gray-600 mb-4">
                    For questions or concerns regarding these Terms or our
                    services, please contact us at:
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <address className="not-italic space-y-2 text-gray-600">
                      <p className="font-semibold">fkoi88.me</p>
                      <p>Select Koi Inc.</p>
                      <p>FPTU Ho Chi Minh City</p>
                      <p>Viet Nam</p>
                      <p className="text-blue-600">+84 123 456 789</p>
                      <p className="text-blue-600">contact@fkoi88.me</p>
                    </address>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Terms;
