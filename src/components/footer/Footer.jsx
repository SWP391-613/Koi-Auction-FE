import React from "react";
import SecurityIcon from "@mui/icons-material/Security";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeIcon from "@mui/icons-material/Home";
import AuctionIcon from "@mui/icons-material/Gavel";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="shadow-lg border-solid border-t-4 bg-[#F1F1F1] dark:bg-gray-800 text-white p-8"
      style={{ boxShadow: "0 -2px 2px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="max-w-6xl mx-auto flex justify-start flex-wrap gap-12">
        <Link to="/" className="mb-4 md:mb-0">
          <img
            src="/koi-svgrepo-com.svg"
            alt="Koi Auction Logo"
            className="w-12 h-auto max-w-full"
          />
        </Link>
        <div className="flex flex-col mb-4">
          <h3 className="text-[#121212] text-xl mb-4 font-bold bg-gray-300 rounded-xl p-2">
            Navigation
          </h3>
          <FooterLink href="/" icon={<HomeIcon />} text="Home" />
          <FooterLink href="/auctions" icon={<AuctionIcon />} text="Auctions" />
          <FooterLink href="/about" icon={<InfoIcon />} text="About" />
        </div>
        <div className="flex flex-col mb-4">
          <h3 className="text-[#121212] text-xl mb-4 font-bold bg-gray-300 rounded-xl p-2">
            Policy
          </h3>
          <FooterLink
            href="/privacy"
            icon={<SecurityIcon />}
            text="Privacy Policy"
          />
          <FooterLink
            href="/terms"
            icon={<DescriptionIcon />}
            text="Terms and Conditions"
          />
        </div>
        <div className="flex flex-col mb-4">
          <h3 className="text-[#121212] text-xl mb-4 font-bold bg-gray-300 rounded-xl p-2">
            Account
          </h3>
          <FooterLink href="/login" icon={<LoginIcon />} text="Login" />
          <FooterLink
            href="/register"
            icon={<PersonAddIcon />}
            text="Register"
          />
        </div>
      </div>
      <div className="text-center mt-8 text-sm text-gray-400">
        AuctionKoi.com is a division of SelectKoi.com
      </div>
    </footer>
  );
}

function FooterLink({ href, icon, text }) {
  return (
    <a
      href={href}
      className="flex items-center text-[#121212] px-4 py-2 rounded-full mb-2 transition duration-300 ease-in-out hover:bg-gray-700 dark:hover:bg-gray-600 group"
    >
      <div className="transform transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:rotate-12">
        {icon}
      </div>
      <span className="ml-2 transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:translate-x-8">
        {text}
      </span>
    </a>
  );
}

export default Footer;
