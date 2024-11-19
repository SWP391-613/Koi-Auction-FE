export const FOOTER_LABEL = {
  HOME: "Home",
  AUCTIONS: "Auctions",
  ABOUT: "About",
  PRIVACY_POLICY: "Privacy Policy",
  TERMS_AND_CONDITIONS: "Terms and Conditions",
  LOGIN: "Login",
} as const;

export const NAVBAR_LABEL = {
  HOME: "Home",
  AUCTIONS: "Auctions",
  BLOGS: "Blogs",
  ABOUT: "About",
} as const;

export const KOI_INFO_LABEL = {
  SEX: "Sex",
  LENGTH: "Length",
  YEAR_BORN: "Year Born",
  CATEGORY: "Category",
  BASE_PRICE: "Base Price",
  CURRENT_PRICE: "Current Price",
  CURRENT_BID: "Current Bid",
  HIDDEN: "Hidden",
  BID_METHOD: "Bid Method",
  BID_STEP: "Bid Step",
  SALES_PRICE: "Sales Price",
} as const;

export const SEARCH_LABEL = {
  SEARCH_ALL_KOI: "Search all koi",
  SEARCH_BREEDER_KOI: "Search breeder's koi",
  SEARCH_UNVERIFIED_KOI: "Search unverified koi",
  SEARCH_ALL_OUR_AUCTION: "Search all our auction",
  SEARCH_ALL_OUR_UPCOMING_AUCTION: "Search all our upcoming auction",
  SEARCH_ALL_OUR_AVAILABLE_KOI: "Search all our available koi",
} as const;

export const SEARCH_DESCRIPTION = {
  SEARCH_ALL_KOI_DESCRIPTION:
    "*Note: Search on name, sex, length, age, price, description,....",
  SEARCH_ALL_OUR_AUCTION_DESCRIPTION: `*Note: Search on name, status, start date, end date,...`,
  SEARCH_ALL_OUR_AVAILABLE_KOI_DESCRIPTION: `*Note: Search on name, sex, length, year born, breeder, price, ceiling
          price, description, bid step, bid method....`,
} as const;

export const KOI_CREATE_FORM_LABEL = {
  NAME: "Name",
  LENGTH: "Length (cm)",
  YEAR_BORN: "Year Born",
  BASE_PRICE: "Base Price (VND)",
  DESCRIPTION: "Description",
  THUMBNAIL_URL: "Thumbnail URL",
} as const;

export const DETAIL_NAVBAR_LABEL = {
  MY_PROFILE: "My Profile",
  //member
  ORDERS: "Orders",
  PAYMENTS: "Payments",

  //staff
  NOTIFICATIONS: "Notifications",
  VERIFY_KOIS: "Verify Kois",

  //breeder
  ADD_KOI: "Add Koi",
  PENDING_KOI: "Pending Koi",
  REGISTER_TO_AUCTION: "Register to Auction",

  //manager
  AUCTION_MANAGEMENT: "Auction Management",
  KOI_MANAGEMENT: "Koi Management",
  BREEDER_MANAGEMENT: "Breeder Management",
  STAFF_MANAGEMENT: "Staff Management",
  MEMBER_MANAGEMENT: "Member Management",
  PAYMENT_MANAGEMENT: "Payment Management",
  ORDER_MANAGEMENT: "Order Management",
};
