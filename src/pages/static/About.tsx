import React from "react";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="p-6">
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold">Welcome to Koi Auction!</h1>
          </div>
          <p className="mb-6 text-base text-gray-700">
            Koi Auction! is proud to be your premier destination for Japanese
            Koi auctions in Vietnam. Our platform is dedicated to connecting Koi
            enthusiasts and collectors with reputable breeders around the
            country, offering an exceptional selection of exquisite Japanese
            Koi.
          </p>
          <p className="mb-6 text-base text-gray-700">
            With a deep passion for the artistry and beauty of Koi, we have
            created an online marketplace that brings together the finest
            breeders and the most discerning buyers. Our auctions provide a
            unique opportunity for Koi enthusiasts to acquire top-quality fish
            directly from renowned breeders in Japan, all from the comfort of
            their own homes.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-lg bg-[#FFFFFF] shadow-lg">
        <div className="p-6">
          <h2 className="mb-2 text-2xl font-bold">
            Frequently Asked Questions
          </h2>

          <h3 className="mt-4 font-semibold">How does the auction work?</h3>
          <p className="mb-4 text-gray-700">
            During an auction, koi are not yet in our Company and are still at
            the Breeder's place. Koi that are won are then shipped to the
            company, and shipped via our transit system to the Buyer. The Buyer
            is responsible for all shipping and handling fees which are invoiced
            post auction. We will contact you via phone or email to arrange a
            preferred shipping time, location, and payment.
          </p>

          <h3 className="mt-4 font-semibold">
            How does shipping work and how much does it cost?
          </h3>
          <p className="mb-4 text-gray-700">
            When you win a koi, we'll reach out to you to schedule a shipping
            date for which the default method is Delta Cargo. Shipping costs
            vary depending on the size of the koi and the type of auction you
            are participating in. A deposit will be charged per koi won at the
            end of each auction to cover the cost of shipping, which varies from
            shipment to shipment. Shipping costs are assessed post-auction, and
            any additional fees or refunds will be invoiced separately.
          </p>

          <h3 className="mt-4 font-semibold">
            What happens if my koi passes away in transit?
          </h3>
          <p className="mb-4 text-gray-700">
            If your koi passes away in transit from a Breeder to our Company,
            you will be credited the amount paid for your loss to your Koi
            Auction! account to bid on future auctions. In the event your koi
            passes away in your location, the cost of the Koi is unfortunately
            not normally able to be refunded or credited.
          </p>

          <h3 className="mt-4 font-semibold">How does the payment work?</h3>
          <p className="mb-4 text-gray-700">
            You need to deposit money into your wallet before placing an
            auction. For each bid on the auction, a corresponding amount will be
            deducted from your wallet. If the auction is successful, the
            previous bid amount will be officially paid. If you lose the bid,
            the amount will be returned to your wallet.
          </p>

          <h3 className="mt-4 font-semibold">
            Is there bid sniping protection?
          </h3>
          <p className="mb-6 text-gray-700">
            Yes, bids made in the final 5 minutes of the auction will add 5
            minutes to the time remaining to bid for that specific koi.
          </p>
        </div>
        <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-2 text-2xl font-bold">Contact Us</h2>
          <p className="text-gray-700">
            Phone:{" "}
            <a href="tel:+18658767474" className="text-blue-600">
              +1 (865) 876-7474
            </a>
          </p>
          <p className="text-gray-700">
            Email:{" "}
            <a href="mailto:contact@auctionkoi.com" className="text-blue-600">
              contact@auctionkoi.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
