import React from "react";
import { motion } from "framer-motion";

const Privacy: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

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
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent text-center mb-6">
            Privacy Policy for fkoi88.me
          </h1>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              fkoi88.me ("us", "we", or "our") is a koi auction website owned
              and operated by Select Koi Inc., a US-based company. Our website,
              fkoi88.me, is designed to provide a platform for customers to bid
              on and purchase koi fish from reputable Japanese breeders.
            </p>
            <p>
              Your privacy is our top priority. This Privacy Policy applies to
              all the services provided by fkoi88.me, and describes the types of
              information we collect, how it is used, and your rights to update,
              modify or delete your personal information.
            </p>
            <p>
              By using our services, you consent to the collection, use, and
              disclosure of your information as outlined in this Privacy Policy.
            </p>
          </div>
        </motion.div>

        {/* Main Content Sections */}
        <motion.div
          className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl ring-1 ring-black/5"
          {...fadeIn}
        >
          <div className="space-y-12">
            {/* Information Collection Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-lg">
                  1
                </span>
                Information We Collect
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 mb-4">
                  When you register for an account on fkoi88.me, we collect the
                  following information to deliver our services to you:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[
                    "Your name",
                    "Mailing Address",
                    "Email Address",
                    "Contact phone number",
                    "Billing and payment information",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-gray-600"
                    >
                      <span className="text-blue-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Information Usage Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-lg">
                  2
                </span>
                How We Use Your Information
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 mb-4">
                  We use your personal data in the following ways:
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "To manage and maintain your account",
                    "To process and fulfill koi purchases, including payment processing and shipping",
                    "To send transactional emails, such as order confirmations and shipping notifications",
                    "To send promotional and marketing emails, if you have opted in",
                    "To communicate any changes or updates to our services or policies",
                    "To improve and analyze the performance of our website",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-gray-600"
                    >
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-lg">
                  8
                </span>
                Contact Us
              </h2>
              <div className="ml-11">
                <p className="text-gray-600 mb-4">
                  If you have any questions or concerns regarding this Privacy
                  Policy or our practices, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <address className="not-italic space-y-2 text-gray-600">
                    <p className="font-semibold">fkoi88.me</p>
                    <p>Select Koi Inc.</p>
                    <p>FPTU Ho Chi Minh City</p>
                    <p>Viet Nam</p>
                    <p className="text-blue-600">+1 (123)-345-1231</p>
                    <p className="text-blue-600">contact@fkoi88.me</p>
                  </address>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-600 italic">
                Thank you for choosing fkoi88.me for your koi fish purchase. We
                take your privacy seriously and are committed to providing a
                secure and enjoyable experience.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Privacy;
