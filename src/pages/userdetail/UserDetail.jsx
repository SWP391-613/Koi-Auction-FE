import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import user_data from "../../utils/data/user_data.json";
import "./UserDetail.scss";
import { getCookie } from "~/utils/cookieUtils";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (getCookie("access_token") === null) {
      navigate("/notfound");
      return;
    }

    const foundUser = user_data.items; // Directly using the new structure
    if (foundUser) {
      setUser(foundUser);

      if (foundUser.status_name.name === "Available") {
        const timer = setInterval(() => {
          // Update the countdown logic as needed
          setTimeLeft("00:00:00");
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [id]);

  if (!user) {
    return <div>User Not found</div>;
  }

  const handleUpdateAccount = () => {
    navigate(`/update-account/${user.id}`);
  };

  const isAvailable = user.status_name.name === "Available";

  return (
    <div className="user-detail-page flex flex-col bg-[#F0F0F0]">
      <div className="auction-header mb-6 flex flex-col items-center justify-between bg-[#FFF]">
        <h1 className="text-4xl">User Details</h1>
      </div>
      <div className="user-detail-conten flex bg-white">
        <div className="flex flex-col gap-2">
          <img
            src={user.avatar_url}
            alt={`${user.first_name} ${user.last_name}`}
            className="user-detail-image"
          />
        </div>
        <div className="user-detail-right">
          <h1 className="user-detail-title">{`${user.first_name} ${user.last_name}`}</h1>
          <div className="user-rating">
            <span className="star-rating">★★★★★</span>
            <span className="user-id">#{user.id}</span>
            {isAvailable && <span className="live-tag">Live</span>}
          </div>
          <div className="user-info-grid">
            <div className="text-lg font-bold">
              <span className="text-lg text-[#666]">Phone: </span>
              <span className="info-value">{user.phone_number}</span>
            </div>
            <div className="text-lg font-bold">
              <span className="text-lg text-[#666]">Email: </span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="text-lg font-bold">
              <span className="text-lg text-[#666]">Address: </span>
              <span className="info-value">{user.address}</span>
            </div>
            <div className="text-lg font-bold">
              <span className="text-lg text-[#666]">Role: </span>
              <span className="info-value">{user.role_name.name}</span>
            </div>
            <div className="text-lg font-bold">
              <span className="text-lg text-[#666]">Status Name: </span>
              <span className="info-value text-red-500">
                {user.status_name.name}
              </span>
            </div>
            <div className="text-lg font-bold">
              <span className="text-lg text-[#666]">Role Name: </span>
              <span className="info-value">{user.role_name.name}</span>
            </div>
            <div className="text-lg font-bold">
              <span className="text-lg text-[#666]">Wallet Balance: </span>
              <span className="info-value">{user.wallet_id}</span>
            </div>
          </div>
          <button onClick={handleUpdateAccount} className="font-bold"></button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
