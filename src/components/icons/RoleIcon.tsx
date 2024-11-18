import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faFish,
  faLock,
  faScrewdriver,
} from "@fortawesome/free-solid-svg-icons";
import { RoleName } from "~/types/roles.type";

interface RoleIconProps {
  isLoggedIn: boolean;
  user: any;
  onClick: () => void;
}

export const RoleIcon: React.FC<RoleIconProps> = ({
  isLoggedIn,
  user,
  onClick,
}) => {
  return (
    <div className="relative">
      <button onClick={onClick} className="p-2 hover:bg-gray-100 rounded-full">
        {isLoggedIn && user ? (
          <>
            {user.role_name === RoleName.MANAGER && (
              <FontAwesomeIcon
                icon={faLock}
                className="h-6 w-6 text-gray-600"
              />
            )}
            {user.role_name === RoleName.STAFF && (
              <FontAwesomeIcon
                icon={faScrewdriver}
                className="h-6 w-6 text-gray-600"
              />
            )}
            {user.role_name === RoleName.BREEDER && (
              <FontAwesomeIcon
                icon={faFish}
                className="h-6 w-6 text-gray-600"
              />
            )}
            {user.role_name === RoleName.MEMBER && (
              <FontAwesomeIcon
                icon={faCartShopping}
                className="h-6 w-6 text-gray-600"
              />
            )}
          </>
        ) : (
          <FontAwesomeIcon
            icon={faCartShopping}
            className="h-6 w-6 text-gray-600"
          />
        )}
      </button>
    </div>
  );
};
