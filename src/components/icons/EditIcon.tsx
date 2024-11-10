import React from "react";
import { SVGProps } from "react";

export const EditIcon = ({
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
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);
