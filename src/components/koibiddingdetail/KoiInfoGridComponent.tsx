import {
  faArrowUp,
  faCalendarDays,
  faDollarSign,
  faFish,
  faGavel,
  faHandHoldingHeart,
  faRuler,
  faVenusMars,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { AuctionKoi } from "~/types/auctionkois.type";
import { KoiDetailModel } from "~/types/kois.type";
import { UserDetailsResponse } from "~/types/users.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { formatCurrency } from "~/utils/currencyUtils";
import { convertDataToReadable, getCategoryName } from "~/utils/dataConverter";
import CountdownClock from "../auctions/CountdownClock";
import LoginOrRegister from "../auth/LoginOrRegister";
import { KoiDetailItem } from "./KoiBiddingDetailComponent";
import { KOI_INFO_LABEL } from "~/constants/label";
import { fetchUserDetails } from "~/apis/user.apis";

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
  const [currentBalance, setCurrentBalance] = useState<number | null>(
    user?.account_balance || null,
  );

  // Add effect to update balance when auctionKoi.current_bid changes
  useEffect(() => {
    const updateUserBalance = async () => {
      if (user) {
        try {
          const updatedUser = await fetchUserDetails();
          setCurrentBalance(updatedUser.account_balance);
        } catch (error) {
          console.error("Failed to fetch updated user balance:", error);
        }
      }
    };

    updateUserBalance();
  }, [auctionKoi.current_bid]); // Dependency on current_bid

  const koiInfoItems = [
    {
      icon: faVenusMars,
      label: KOI_INFO_LABEL.SEX,
      value: convertDataToReadable(koi.sex),
      bgColor: "bg-gray-300",
    },
    {
      icon: faRuler,
      label: KOI_INFO_LABEL.LENGTH,
      value: koi.length + " cm",
      bgColor: "bg-gray-300",
    },
    {
      icon: faCalendarDays,
      label: KOI_INFO_LABEL.YEAR_BORN,
      value: koi.year_born,
      bgColor: "bg-gray-300",
    },
    {
      icon: faFish,
      label: KOI_INFO_LABEL.CATEGORY,
      value: getCategoryName(koi.category_id),
      bgColor: "bg-gray-300",
    },
    auctionKoi.bid_method !== "DESCENDING_BID" &&
      auctionKoi.bid_method !== "SEALED_BID" && {
        icon: faDollarSign,
        label:
          auctionKoi.bid_method === "FIXED_PRICE"
            ? KOI_INFO_LABEL.SALES_PRICE
            : KOI_INFO_LABEL.BASE_PRICE,
        value: formatCurrency(auctionKoi.base_price),
        bgColor: "bg-blue-200",
      },
    {
      icon: faGavel,
      label:
        auctionKoi.bid_method === "DESCENDING_BID"
          ? KOI_INFO_LABEL.CURRENT_PRICE
          : KOI_INFO_LABEL.CURRENT_BID,
      value:
        auctionKoi.bid_method === "SEALED_BID" && !auctionKoi.is_sold
          ? KOI_INFO_LABEL.HIDDEN
          : formatCurrency(auctionKoi.current_bid),
      bgColor: "bg-green-200",
    },
    {
      icon: faHandHoldingHeart,
      label: KOI_INFO_LABEL.BID_METHOD,
      value: convertDataToReadable(auctionKoi.bid_method),
      bgColor: "bg-blue-200",
    },
    ...(auctionKoi.bid_method === "ASCENDING_BID"
      ? [
          {
            icon: faArrowUp,
            label: KOI_INFO_LABEL.BID_STEP,
            value: formatCurrency(auctionKoi.bid_step),
            bgColor: "bg-blue-200",
          },
        ]
      : []),
  ].filter(Boolean);

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
              value={`${formatCurrency(currentBalance || user.account_balance)}`}
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
