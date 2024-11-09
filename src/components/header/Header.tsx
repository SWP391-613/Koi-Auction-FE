import React, { useState } from "react";
import { useNavbar } from "../../contexts/NavbarContext";
import { useAuth } from "../../contexts/AuthContext";
import { useUserData } from "~/hooks/useUserData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Clock } from "../clock/Clock";
import { SearchBar } from "../search/SearchBar";
import { RoleIcon } from "../roleIcon/RoleIcon";
import { UserProfile } from "../userProfile/UserProfile";

const Header = () => {
  const { isNavCollapsed } = useNavbar();
  const { user } = useUserData();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleRoleIconClick = () => {
    if (isLoggedIn && user) {
      switch (user.role_name) {
        case "manager":
          navigate("/managers");
          break;
        case "staff":
          navigate("/staffs");
          break;
        case "breeder":
          navigate("/breeders");
          break;
        case "member":
          navigate("/orders");
          break;
      }
    } else {
      toast.warning("Please login to access this feature!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        fixed top-0
        ${isNavCollapsed ? "left-20" : "left-60"}
        right-0
        h-16
        bg-gray-300
        shadow-sm
        z-10
        transition-all
        duration-300
      `}
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="mr-4">
          <Clock />
        </div>

        {/* <SearchBar /> */}

        <div className="flex items-center space-x-6 ">
          <RoleIcon
            isLoggedIn={isLoggedIn}
            user={user}
            onClick={handleRoleIconClick}
          />
          <div className="h-8 w-px bg-gray-200"></div>
          <UserProfile isLoggedIn={isLoggedIn} user={user} />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
