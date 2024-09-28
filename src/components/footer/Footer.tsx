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
      className="border-t-4 border-solid bg-[#F1F1F1] p-8 text-white shadow-lg dark:bg-gray-800"
      style={{ boxShadow: "0 -2px 2px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap justify-start gap-12">
        <Link to="/" className="mb-4 md:mb-0">
          <img
            src="/koi-svgrepo-com.svg"
            alt="Koi Auction Logo"
            className="h-auto w-12 max-w-full"
          />
        </Link>
        <div className="mb-4 flex flex-col">
          <h3 className="mb-4 rounded-xl bg-gray-300 p-2 text-xl font-bold text-[#121212]">
            Navigation
          </h3>
          <FooterLink href="/" icon={<HomeIcon />} text="Home" />
          <FooterLink href="/auctions" icon={<AuctionIcon />} text="Auctions" />
          <FooterLink href="/about" icon={<InfoIcon />} text="About" />
        </div>
        <div className="mb-4 flex flex-col">
          <h3 className="mb-4 rounded-xl bg-gray-300 p-2 text-xl font-bold text-[#121212]">
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
        <div className="mb-4 flex flex-col">
          <h3 className="mb-4 rounded-xl bg-gray-300 p-2 text-xl font-bold text-[#121212]">
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
      <div className="mt-8 text-center text-sm text-gray-400">
        AuctionKoi.com is a division of SelectKoi.com
      </div>
    </footer>
  );
}

function FooterLink({ href, icon, text }) {
  return (
    <a
      href={href}
      className="group mb-2 flex items-center rounded-full px-4 py-2 text-[#121212] transition duration-300 ease-in-out hover:bg-gray-300 hover:text-black dark:hover:bg-gray-600"
    >
      <div className="transform transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:rotate-12">
        {icon}
      </div>
      <span className="ml-2 transition-all duration-300 ease-in-out group-hover:translate-x-8 group-hover:opacity-0">
        {text}
      </span>
    </a>
  );
}

export default Footer;
