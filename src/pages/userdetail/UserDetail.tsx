import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UserDetail.scss";
import { getCookie } from "~/utils/cookieUtils";
import { log } from "console";
import axios from "axios";

interface Status {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
  address: string;
  password: string | null;
  status_name: Status;
  avatar_url: string;
  google_account_id: number;
  role_name: Role;
  account_balance: number;
  wallet_id: number;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (getCookie("access_token") === null) {
        navigate("/notfound");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/members/${id}`,
        );
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const userData: User = await response.data;
        console.log(userData);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        navigate("/notfound");
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-detail p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <img
        src={user.avatarUrl}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-32 h-32 rounded-full object-cover mb-4 mx-auto"
      />
      <h1 className="text-2xl font-bold mb-2 text-center">
        <span className="text-gray-500">Full Name: </span>
        {user.firstName} {user.lastName}
      </h1>
      <p className="text-gray-700 mb-1">
        <span className="font-semibold">Email:</span> {user.email}
      </p>
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">Address:</span> {user.address}
      </p>
    </div>
  );
};

export default UserDetail;
