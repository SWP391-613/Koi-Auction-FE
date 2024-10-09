import React from "react";

const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy for fkoi88.me</h1>
      <p className="mb-4">
        fkoi88.me ("us", "we", or "our") is a koi auction website owned and
        operated by Select Koi Inc., a US-based company. Our website, fkoi88.me,
        is designed to provide a platform for customers to bid on and purchase
        koi fish from reputable Japanese breeders.
      </p>
      <p className="mb-4">
        Your privacy is our top priority. This Privacy Policy applies to all the
        services provided by fkoi88.me, and describes the types of information
        we collect, how it is used, and your rights to update, modify or delete
        your personal information.
      </p>
      <p className="mb-6">
        By using our services, you consent to the collection, use, and
        disclosure of your information as outlined in this Privacy Policy.
      </p>

      <div className="m-5">
        <h2 className="text-2xl font-semibold mb-4">
          1. Information We Collect
        </h2>
        <p className="mb-4">
          When you register for an account on fkoi88.me, we collect the
          following information to deliver our services to you:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Your name</li>
          <li>Mailing Address</li>
          <li>Email Address</li>
          <li>Contact phone number</li>
          <li>Billing and payment information</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          2. How We Use Your Information
        </h2>
        <p className="mb-4">We use your personal data in the following ways:</p>
        <ul className="list-disc list-inside mb-6">
          <li>To manage and maintain your account</li>
          <li>
            To process and fulfill koi purchases, including payment processing
            and shipping
          </li>
          <li>
            To send transactional emails, such as order confirmations, shipping
            notifications, and payment-related information
          </li>
          <li>
            To send promotional and marketing emails, if you have opted into our
            email system
          </li>
          <li>
            To communicate any changes or updates to our services or policies
          </li>
          <li>To improve and analyze the performance of our website</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          3. Sharing your information
        </h2>
        <p className="mb-4">
          We do not sell or share your personal information with third parties,
          except when necessary to fulfill our services, as follows:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>
            We share your payment information with our payment processor, solely
            for the purpose of processing your payment transactions.
          </li>
          <li>
            We share your shipping information with our chosen courier or postal
            services for delivering the Koi fish you have purchased.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          4. Your Choices and Rights
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>
            You may update, modify, or delete your personal information or
            deactivate your fkoi88.me account at any time by sending us a
            request to our customer support.
          </li>
          <li>
            You may choose to unsubscribe from our marketing emails by following
            the "unsubscribe" link or instructions provided in our promotional
            emails or by contacting our customer support.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
        <p className="mb-6">
          We have implemented and maintain appropriate security measures to
          protect your personal data from unauthorized access, alteration,
          disclosure, or destruction. However, no method of data storage or
          transmission is 100% secure, thus we cannot guarantee absolute
          security.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. Children's Privacy</h2>
        <p className="mb-6">
          fkoi88.me is not intended for use by individuals under the age of 18.
          We do not knowingly collect personal data from minors. If you become
          aware that a child has provided us with personal data, please contact
          us immediately, and we will take steps to delete such information from
          our system.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          7. Updates to this Privacy Policy
        </h2>
        <p className="mb-6">
          We may update the Privacy Policy from time to time, and any changes
          will be posted on this page. We encourage you to review this Privacy
          Policy periodically to stay informed about how we are protecting your
          information.
        </p>

        <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns regarding this Privacy Policy or
          our practices, please contact us at:
        </p>
        <address className="mb-6">
          fkoi88.me
          <br />
          Select Koi Inc.
          <br />
          FPTU Ho Chi Minh City
          <br />
          Viet Nam
          <br />
          +1 (123)-345-1231
          <br />
          contact@fkoi88.me
        </address>

        <p className="mb-4">
          Thank you for choosing fkoi88.me for your koi fish purchase. We take
          your privacy seriously and are committed to providing a secure and
          enjoyable experience.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
