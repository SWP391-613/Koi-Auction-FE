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
} from "@fortawesome/free-solid-svg-icons";
import { KoiDetailItem } from "./KoiBiddingDetailComponent";
import { UserDetailsResponse } from "~/types/users.type";
import { convertBidMethodToReadable } from "~/utils/dataConverter";
import { KoiDetailModel } from "~/types/kois.type";
import { AuctionKoi } from "~/types/auctionkois.type";

interface KoiInfoGridProps {
  koi: KoiDetailModel;
  auctionKoi: AuctionKoi;
  user: UserDetailsResponse | null;
}

export const KoiInfoGridComponent: React.FC<KoiInfoGridProps> = ({
  koi,
  auctionKoi,
  user,
}) => {
  const koiInfoItems = [
    { icon: faVenusMars, label: "Sex", value: koi.sex, bgColor: "bg-gray-300" },
    {
      icon: faRuler,
      label: "Length",
      value: koi.length,
      bgColor: "bg-gray-300",
    },
    {
      icon: faCalendarDays,
      label: "Age",
      value: koi.age,
      bgColor: "bg-gray-300",
    },
    {
      icon: faFish,
      label: "Category ID",
      value: koi.category_id,
      bgColor: "bg-gray-300",
    },
    {
      icon: faDollarSign,
      label: "Base Price",
      value: auctionKoi.base_price,
      bgColor: "bg-blue-200",
    },
    {
      icon: faGavel,
      label: "Current Bid",
      value: auctionKoi.current_bid,
      bgColor: "bg-green-200",
    },
    {
      icon: faHandHoldingHeart,
      label: "Bid Method",
      value: convertBidMethodToReadable(auctionKoi.bid_method),
      bgColor: "bg-blue-200",
    },
  ];

  return (
    <div className="koi-info w-full space-y-4 rounded-2xl bg-gray-200 p-4 text-lg">
      <div className="mb-4 items-center rounded-2xl">
        <div className="grid w-full grid-cols-1 xl:grid-cols-2">
          <h2 className="col-span-1 m-4 text-4xl font-bold xl:col-span-2">
            {koi.name}
          </h2>
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
              value={`$${user.account_balance.toFixed(2)}`}
              bgColor="bg-yellow-200"
              textColor="text-green-700"
            />
          )}
        </div>
      </div>
    </div>
  );
};
