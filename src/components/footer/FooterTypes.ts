// FooterTypes.ts
import { JSX } from "react";

export interface FooterLinkProps {
  href: string;
  icon: JSX.Element;
  text: string;
}

export interface FooterSectionProps {
  title: string;
  links: FooterLinkProps[];
}
