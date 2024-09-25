import { Link } from "react-router-dom";
import koi_data from "../../utils/data/koi_data.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";

const KoiCart = () => {
  const koiItems = koi_data.items;

  const getRandomByColor = () => {
    return Math.random() > 0.5 ? "bg-green-500" : "bg-red-500";
  };

  if (!Array.isArray(koiItems) || koiItems.length === 0) {
    return <div>Không có dữ liệu cá Koi.</div>;
  }

  return (
    <div className="koi-container m-10 grid grid-cols-1 gap-4 p-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {koiItems.map((koi) => (
        <Link
          to={`/koi/${koi.id}`}
          key={koi.id}
          className="koi-card transform overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
        >
          <div className="image-container flex h-48 w-full items-center justify-center bg-gray-200">
            {koi.image ? (
              <img
                src={koi.image.url}
                alt={koi.type}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-500">No Image</span>
            )}
          </div>
          <div className="info p-4">
            <h2 className="title text-2xl font-semibold">{koi.type}</h2>
            <div
              className={`price rounded-xl p-2 text-left text-white ${getRandomByColor()} text-md font-bold`}
            >
              <FontAwesomeIcon icon={faDollarSign} />
              {koi.price} {koi.currency}
            </div>
          </div>
          <div className="details p-2 text-sm text-gray-600">
            <p className="flex justify-between">
              <span>Breeder:</span>
              <span className="text-lg text-black">{koi.breeder}</span>
            </p>
            <p className="flex justify-between">
              <span>Length:</span>
              <span className="text-lg text-black">{koi.length}</span>
            </p>
            <p className="flex justify-between">
              <span>Sex:</span>
              <span className="text-lg text-black">{koi.sex}</span>
            </p>
            <p className="flex justify-between">
              <span>Age:</span>
              <span className="text-lg text-black">
                {koi.age.years} years ({koi.age.type})
              </span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default KoiCart;
