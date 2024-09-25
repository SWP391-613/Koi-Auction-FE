import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import koi_data from "../../utils/data/koi_data.json";
import { useAuth } from "../../AuthContext";
import NavigateButton from "../../components/shared/NavigateButton";

const KoiDetail = () => {
  const { isLoggedIn } = useAuth();
  const { id } = useParams();
  const [koi, setKoi] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    const foundKoi = koi_data.items.find((item) => item.id === parseInt(id));
    setKoi(foundKoi);

    if (foundKoi && foundKoi.status === "Available") {
      const timer = setInterval(() => {
        setTimeLeft("00:00:00");
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [id]);

  if (!koi) {
    return <div className="py-8 text-center">Không tìm thấy cá Koi.</div>;
  }

  const handleBidSubmit = (e) => {
    e.preventDefault();
    console.log(`Bid submitted: ${bidAmount}`);
    setBidAmount("");
  };

  const isAvailable = koi.status === "Available";

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 p-4">
      <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
        <h2 className="text-lg font-bold">
          {isAvailable ? "Ongoing" : "Ended 4 months ago"}
        </h2>
        <span className="text-sm text-gray-600">
          {isAvailable ? "60 minute Auction Info" : "40 minute Auction Info"}
        </span>
      </div>
      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md md:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <img
            src={koi.image.url}
            alt={koi.type}
            className="h-auto w-full rounded-lg object-cover"
          />
          <img
            src={koi.image.url}
            alt={koi.type}
            className="h-24 w-full rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <h1 className="mb-2 text-3xl md:text-5xl">{koi.type}</h1>
          <div className="mb-4 flex justify-around">
            {isAvailable && (
              <span className="rounded-xl bg-green-500 px-3 py-1 font-bold text-white">
                Live
              </span>
            )}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-100 p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Sex</span>
              <span className="font-bold">{koi.sex}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Length</span>
              <span className="font-bold">{koi.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Breeder</span>
              <span className="font-bold">{koi.breeder}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Age</span>
              <span className="font-bold">
                {koi.age.type} ({koi.age.years} years)
              </span>
            </div>
          </div>
          {isAvailable ? (
            <div className="rounded-lg bg-gray-100 p-4">
              <h3 className="mb-4 text-2xl">Bid Details</h3>
              <div className="mb-2 flex justify-between rounded-lg bg-gray-200 p-2">
                <span>Starting time</span>
                <span className="font-bold text-green-600">${koi.price}</span>
              </div>
              <div className="mb-2 flex justify-between rounded-lg bg-gray-200 p-2">
                <span>End time</span>
                <span className="font-bold text-green-600">${koi.price}</span>
              </div>
              <div className="mb-2 flex justify-between rounded-lg bg-gray-200 p-2">
                <span>Step</span>
                <span className="font-bold text-green-600">${koi.price}</span>
              </div>
              <div className="mb-4 flex justify-between rounded-lg bg-gray-200 p-2">
                <span>Current Highest Bidder</span>
                <span className="font-bold text-green-600">${koi.price}</span>
                <span className="text-gray-600">lcaohoanq</span>
              </div>
              <div className="mb-4 text-center font-bold">
                Countdown Timer: {timeLeft}
              </div>
              {isLoggedIn ? (
                <form onSubmit={handleBidSubmit} className="space-y-2">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid"
                    className="w-full rounded-lg border border-gray-300 p-2"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
                  >
                    Place Bid
                  </button>
                </form>
              ) : (
                <div className="space-y-2">
                  <NavigateButton
                    text="Login"
                    to="/login"
                    className="w-full rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                  />
                  <NavigateButton
                    text="Register"
                    to="/register"
                    className="w-full rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-100 p-4">
              <h3 className="mb-4 text-2xl">2 Past Bids</h3>
              <div className="space-y-2">
                <div className="flex justify-between rounded-lg bg-gray-200 p-2">
                  <span className="font-bold text-green-600">${koi.price}</span>
                  <span className="text-gray-600">Winning Bidder</span>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-200 p-2">
                  <span className="font-bold text-green-600">
                    ${koi.price - 50}
                  </span>
                  <span className="text-gray-600">Previous Bidder</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KoiDetail;
