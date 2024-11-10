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
        "By using fkoi88.me, you agree to be bound by the following Terms of Service. These Terms apply to all users of the Site and govern your access and use of the Site and the services provided therein, including the koi auction services. If you do not agree to these Terms, you must discontinue your use of the Site and services.",
    },
    {
      title: "Registration",
      content:
        "To access certain features of the Site and participate in koi auctions, you will need to register an account with fkoi88.me. By registering, you warrant that you have provided true and accurate information and agree to keep your account information up-to-date.",
    },
    {
      title: "Breeder Registration",
      content:
        "To register as a breeder on our Site, you must provide your name, contact information, and a detailed description of your koi breeding practices.\n" +
        "Please contact us at contact@fkoi88.me for more information. You agree to provide accurate and truthful information about your koi and to comply with all applicable laws and regulations. We will respond to your registration request within 7 business days.",
    },
    {
      title: "Koi Registration to Auction",
      content:
        "To register a koi to auction, you must provide a detailed description of the koi, including its appearance, size, and any other relevant information. You agree to provide accurate and truthful information about the koi and to comply with all applicable laws and regulations. We claim 10% of the koi's base price as our service fee.",
    },
    {
      title: "Compliance with Applicable Laws",
      content:
        "As we offer our services to users across various provinces in Vietnam, it is your responsibility to ensure compliance with all applicable local, state, and federal laws and regulations when using our Site and services.",
    },
    {
      title: "Bidding and Auction Terms",
      content:
        "All bids placed on our Site are final and binding. Upon winning a koi auction, you are obligated to make a payment for the koi won, according to the terms set out below.",
    },
    {
      title: "Payment Terms",
      content:
        "Payments for koi won in auction must be made within 72 hours after winning the auction. If payment is not received in time, we reserve the right to cancel the transaction and the koi may not be guaranteed to ship.",
    },
    {
      title: "Shipping and Delivery",
      content:
        "Koi purchased on our Site will be shipped and received in accordance with the associated Breeder's best practices and quarantine procedures. We will make every effort to ensure the safe and timely arrival of your koi, but we cannot guarantee their survival during shipping and receiving from Japan as well as shipping from our US facility to the winner.",
    },
    {
      title: "Refund Policy",
      content:
        "1. For Bidders: In the unfortunate event that your koi dies during shipping Koi to your location, you will be refunded the full amount of your purchase to your account balance (including shipping fee and koi bid price).\n" +
        "2. For Breeder: In the unfortunate event that your koi dies during shipping Koi from our facility to winner's location, you will be refunded the full amount of your cost to your account balance (including shipping fee and koi bid base price)",
    },
    {
      title: "Disclaimer of Warranties",
      content:
        "1. For Bidders: In case of winner's order cancellation (our shipper is unreachable and transfer koi to the winner), winner's purchase will not be refunded to their account balance.\n" +
        "2. For Breeder: In case of Koi dies during shipping from our facility to winner's location, we will not be responsible for the loss.",
    },
    {
      title: "Indemnification",
      content:
        "You agree to indemnify, defend, and hold harmless fkoi88.me, its affiliates, and their respective officers, employees, and agents from any and all claims, losses, or damages arising out of your breach of these Terms or your use of the Site or services.",
    },
    {
      title: "Governing Law and Jurisdiction",
      content:
        "These Terms shall be governed by and construed in accordance with the laws of the Vietnam, without regard to principles of conflict of laws. Any disputes arising from or relating to these Terms, the Site, or services shall be resolved by a court of competent jurisdiction in the Vietnam.",
    },
    {
      title: "Modifications to Terms",
      content:
        "We reserve the right to modify these Terms at any time without prior notice. Your continued use of the Site and our services will signify your acceptance of the updated Terms.",
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
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      {section.title}
                    </h2>
                    {section.content.split("\n").map((line, index) => (
                      <p key={index} className="text-gray-600 leading-relaxed">
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
