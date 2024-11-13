import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faVenusMars,
  faRuler,
  faCalendarDays,
  faFish,
  faDollarSign,
  faGavel,
  faHandHoldingHeart,
  faWallet,
  faStar,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { KoiDetailItem } from "./KoiBiddingDetailComponent";
import { UserDetailsResponse } from "~/types/users.type";
import { convertDataToReadable, getCategoryName } from "~/utils/dataConverter";
import { KoiDetailModel } from "~/types/kois.type";
import { AuctionKoi } from "~/types/auctionkois.type";
import { formatCurrency } from "~/utils/currencyUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginOrRegister from "../auth/LoginOrRegister";
import { getCookie } from "~/utils/cookieUtils";
import { getUserCookieToken } from "~/utils/auth.utils";
import CountdownClock from "../auctions/CountdownClock";

interface KoiInfoGridProps {
  koi: KoiDetailModel;
  auctionKoi: AuctionKoi;
  user: UserDetailsResponse | null;
  endTime: string;
}

export const KoiInfoGridComponent: React.FC<KoiInfoGridProps> = ({
  koi,
  auctionKoi,
  user,
  endTime,
}) => {
  const koiInfoItems = [
    {
      icon: faVenusMars,
      label: "Sex",
      value: convertDataToReadable(koi.sex),
      bgColor: "bg-gray-300",
    },
    {
      icon: faRuler,
      label: "Length",
      value: koi.length,
      bgColor: "bg-gray-300",
    },
    {
      icon: faCalendarDays,
      label: "Year Born",
      value: koi.year_born,
      bgColor: "bg-gray-300",
    },
    {
      icon: faFish,
      label: "Category",
      value: getCategoryName(koi.category_id),
      bgColor: "bg-gray-300",
    },
    {
      icon: faDollarSign,
      label: "Base Price",
      value: ["DESCENDING_BID", "SEALED_BID"].includes(auctionKoi.bid_method)
        ? ""
        : formatCurrency(auctionKoi.base_price),
      bgColor: "bg-blue-200",
    },
    {
      icon: faGavel,
      label:
        auctionKoi.bid_method === "DESCENDING_BID"
          ? "Current Price"
          : "Current Bid",
      value:
        auctionKoi.bid_method === "SEALED_BID" && !auctionKoi.is_sold
          ? "Hidden"
          : formatCurrency(auctionKoi.current_bid),
      bgColor: "bg-green-200",
    },
    {
      icon: faHandHoldingHeart,
      label: "Bid Method",
      value: convertDataToReadable(auctionKoi.bid_method),
      bgColor: "bg-blue-200",
    },
    ...(auctionKoi.bid_method === "ASCENDING_BID"
      ? [
          {
            icon: faArrowUp,
            label: "Bid Step",
            value: formatCurrency(auctionKoi.bid_step),
            bgColor: "bg-blue-200",
          },
        ]
      : []),
  ];

  const accessToken = getUserCookieToken();

  return (
    <div className="koi-info w-full space-y-4 rounded-2xl bg-gray-200 text-lg">
      <div className="mb-2 items-center rounded-2xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-4xl font-bold mb-2 md:mb-0">{koi.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 flex items-center">
            <span className="mr-2">⏱️Time Remaining:</span>
            <CountdownClock endTime={endTime.toString()} />
          </div>
        </div>
        <div className="grid w-full grid-cols-1 xl:grid-cols-2">
          {koiInfoItems.map((item, index) => (
            <KoiDetailItem
              key={index}
              icon={item.icon}
              label={item.label}
              value={item.value}
              bgColor={item.bgColor}
            />
          ))}
          {user && (
            <KoiDetailItem
              icon={faWallet}
              label="Your Balance"
              value={`${formatCurrency(user.account_balance)}`}
              bgColor="bg-yellow-200"
              textColor="text-green-700"
            />
          )}
        </div>
      </div>
      {!accessToken && <LoginOrRegister />}
    </div>
  );
};
