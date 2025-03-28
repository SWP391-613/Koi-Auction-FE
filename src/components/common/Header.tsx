import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useNavbar } from "../../contexts/NavbarContext";
import { Clock } from "../clock/Clock";
import { RoleIcon } from "../icons/RoleIcon";
import { UserProfile } from "../userProfile/UserProfile";
import VerifyPopup from "../verifyPopup/VerifyPopup";
import { ROUTING_PATH } from "~/constants/endPoints";
import { GENERAL_TOAST_MESSAGE } from "~/constants/message";
import { RoleName } from "~/types/roles.type";
import "./Header.css";
import useUserDetail from "~/hooks/useUserData";

const Header = () => {
  const { isNavCollapsed } = useNavbar();
  const { data: user, isLoading, error } = useUserDetail();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);

  const handleLogoClick = () => {
    navigate(ROUTING_PATH.ROOT);
  };

  const handleRoleIconClick = () => {
    if (isLoggedIn && user) {
      switch (user.role_name) {
        case RoleName.MANAGER:
          navigate(ROUTING_PATH.MANAGERS);
          break;
        case RoleName.STAFF:
          navigate(ROUTING_PATH.STAFFS);
          break;
        case RoleName.BREEDER:
          navigate(ROUTING_PATH.BREEDERS);
          break;
        case RoleName.MEMBER:
          if (user.status_name !== "VERIFIED") {
            setIsVerifyPopupOpen(true);
          } else {
            navigate(ROUTING_PATH.MEMBERS_ORDERS);
          }
          break;
      }
    } else {
      toast.warning(GENERAL_TOAST_MESSAGE.PLEASE_LOGIN_TO_ACCESS_THIS_FEATURE, {
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
    <>
      <motion.header
        initial={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`
          fixed top-0 right-0
          ${isNavCollapsed ? "md:left-20" : "md:left-60"}
          left-0
          h-16
          bg-gray-300
          shadow-sm
          z-[51]
          transition-all
          duration-300
        `}
      >
        <div className="flex items-center justify-around h-full px-6">
          <div className="mr-4 hidden md:block">
            <Clock />
          </div>
          <div className="shine cursor-pointer" onClick={handleLogoClick}>
            FKOI88
          </div>

          <div className="flex items-center space-x-6 ">
            <RoleIcon
              isLoggedIn={isLoggedIn}
              user={user}
              onClick={handleRoleIconClick}
            />
            <div className="h-8 w-px bg-gray-200"></div>
            {user && <UserProfile isLoggedIn={isLoggedIn} user={user} />}
          </div>
        </div>
      </motion.header>

      {user && (
        <VerifyPopup
          open={isVerifyPopupOpen}
          onClose={() => setIsVerifyPopupOpen(false)}
          userId={user.id}
        />
      )}
    </>
  );
};

export default Header;
