import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-gray-300  px-4 py-2 rounded-lg shadow-sm">
      <div className="flex items-center justify-center w-10 h-10 bg-blue-900 rounded-full">
        <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-white" />
      </div>
      <div className="flex flex-col">
        <div className="text-base font-semibold text-gray-700">
          {time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </div>
        <div className="text-xs text-gray-500">
          {time
            .toLocaleDateString("vi-VN", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(",", "")}
        </div>
      </div>
    </div>
  );
};
