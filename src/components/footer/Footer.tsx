// Footer.tsx
import React from "react";
import SecurityIcon from "@mui/icons-material/Security";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeIcon from "@mui/icons-material/Home";
import AuctionIcon from "@mui/icons-material/Gavel";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link } from "react-router-dom";
import FooterSection from "./FooterSection";
import { FooterLinkProps } from "./FooterTypes";

const Footer: React.FC = () => {
  const navLinks: FooterLinkProps[] = [
    { href: "/", icon: <HomeIcon />, text: "Home" },
    { href: "/auctions", icon: <AuctionIcon />, text: "Auctions" },
    { href: "/about", icon: <InfoIcon />, text: "About" },
  ];

  const policyLinks: FooterLinkProps[] = [
    { href: "/privacy", icon: <SecurityIcon />, text: "Privacy Policy" },
    { href: "/terms", icon: <DescriptionIcon />, text: "Terms and Conditions" },
  ];

  const accountLinks: FooterLinkProps[] = [
    { href: "/login", icon: <LoginIcon />, text: "Login" },
    { href: "/register", icon: <PersonAddIcon />, text: "Register" },
  ];

  return (
    <footer className="bg-[#CACBCF] p-8 text-white shadow-lg">
      <div className="mx-auto flex flex-col md:flex-row justify-between mb-[6rem]">
        <Link to="/" className="md:mb-0 flex items-center justify-center">
          <img
            src="/koi-svgrepo-com.svg"
            alt="Koi Auction Logo"
            className="w-24 max-w-full"
          />
        </Link>

        <FooterSection title="Navigation" links={navLinks} />
        <FooterSection title="Policy" links={policyLinks} />
        <FooterSection title="Account" links={accountLinks} />
      </div>
      <div className="mt-8 text-center text-md font-bold text-gray-600">
        AuctionKoi.com is a division of SelectKoi.com
      </div>
    </footer>
  );
};

export default Footer;
