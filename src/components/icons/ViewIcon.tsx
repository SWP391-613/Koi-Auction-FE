import React from "react";
import { SVGProps } from "react";

export const ViewIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 20 20"
    width={width || size}
    {...props}
  >
    <path
      d="M10 12a2 2 0 100-4 2 2 0 000 4z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
