import React from "react";
import { memo } from "react";
import { Helmet } from "react-helmet-async";
import Footer from "~/components/common/Footer";
import Header from "~/components/common/Header";
import DetailNavbar from "~/components/shared/DetailNavbar";
import { useNavbar } from "~/contexts/NavbarContext";
import NavBar from "../components/common/NavBar";

interface Props {
  children: React.ReactNode;
}

const MainLayoutInner: React.FC<Props> = ({ children }) => {
  // Add this line to access the navbar state
  const { isNavCollapsed, isMobileNavVisible } = useNavbar();

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{"Koi Auction"}</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex flex-grow">
          <Header />
          <main
            className={`flex-1 transition-all duration-300
      ${isNavCollapsed ? "md:ml-20" : "md:ml-60"}
      ${isMobileNavVisible ? "mb-[60px]" : "mb-0"}
      md:mb-0
      pt-16`}
          >
            <DetailNavbar />
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

const MainLayout = memo(MainLayoutInner);

export default MainLayout;
