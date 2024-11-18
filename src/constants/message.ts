export const SUCCESS_MESSAGE = {
  BID_PLACED: "Bid placed successfully!",
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Logout successful!",
  REGISTER_SUCCESS: "Registration successful!",
  DEPOSIT_SUCCESS: "Deposit successful!",
  OTP_VERIFY_SUCCESS: "OTP verification successful!",
  HIGHEST_BID_RECEIVED: "New highest bid received!",
  //"Koi registered successfully!"
  REGISTER_KOI_SUCCESS: "Koi registered successfully!",
  DELETE_KOI_SUCCESS: "Koi deleted successfully!",
} as const;

export const ERROR_MESSAGE = {
  REQUIRED_LOGIN_TO_BID: "Please log in before placing a bid.",
  UNEXPECTED_ERROR_BID: "An unexpected error occurred while placing your bid.",
  OTP_VERIFICATION_ERROR: "An error occurred during OTP verification.",
  SELECT_KOI_AND_AUCTION: "Please select a koi and an auction to place a bid.",
  REGISTER_KOI_FAILED: "Failed to register koi.",
  DELETE_KOI_FAILED: "Failed to delete koi.",
  FETCH_KOI_ERROR: "Error fetching kois",
  FAILED_TO_LOAD_AUCTION_DETAILS: "Failed to load auction details.",
  FAILED_TO_FETCH_BIDDING_HISTORY: "Failed to fetch bidding history.",
  FAILED_TO_FETCH_AUCTIONS: "Failed to fetch auctions.",
  FAILED_TO_LOAD_BANKS_LIST: "Failed to load banks list.",
  ERROR_CREATING_KOI: "Error creating koi.",
  UNEXPECTED_ERROR: "An unexpected error occurred.",
  LOGIN_ERROR: "An error occurred during login",
  REGISTER_ERROR: "An error occurred during registration",
  CREATE_AUCTION_ERROR: "An error occurred during auction creation",
  FETCH_AUCTION_ERROR: "An error occurred during auction fetching",
  FETCH_AUCTION_BY_STATUS_ERROR:
    "An error occurred during fetching auction by status",
  FETCH_AUCTION_BY_ID_ERROR: "An error occurred during fetching auction by ID",
  FETCH_AUCTION_KOI_ERROR: "An error occurred during fetching auction koi",
  FETCH_BREEDER_KOI_ERROR: "An error occurred during fetching breeder koi",
  FETCH_BREEDER_KOI_WITH_STATUS_ERROR:
    "An error occurred during fetching breeder koi with status",
  FETCH_KOI_BY_ID_ERROR: "An error occurred during fetching koi by ID",
  FAILED_TO_LOAD_AUCTION_KOI_DETAILS: "Failed to load auction koi details.",
  FAILED_TO_UPDATE_KOI: "Failed to update koi.",
  FAILED_TO_LOAD_KOI_DETAILS: "Failed to load koi details.",
  FAILED_TO_LOAD_KOIS: "Failed to load kois.",
  FAILED_TO_DELETE_KOI: "Failed to delete koi.",
  FAILED_TO_LOAD_KOIS_IN_AUCTION: "Failed to load kois in auction.",

  FETCH_BREEDERS_ERROR: "An error occurred during fetching breeders",
  FETCH_BREEDER_BY_ID_ERROR: "An error occurred during fetching breeder by ID",
  CREATE_BREEDER_ERROR: "An error occurred during creating breeder",
  UPDATE_BREEDER_ERROR: "An error occurred during updating breeder",
  DELETE_BREEDER_ERROR: "An error occurred during deleting breeder",

  FETCH_MEMBERS_ERROR: "An error occurred during fetching members",
  FETCH_MEMBER_BY_ID_ERROR: "An error occurred during fetching member by ID",
  CREATE_MEMBER_ERROR: "An error occurred during creating member",
  UPDATE_MEMBER_ERROR: "An error occurred during updating member",
  DELETE_MEMBER_ERROR: "An error occurred during deleting member",

  FETCH_MANAGER_ERROR: "An error occurred during fetching manager",
  FETCH_MANAGER_BY_ID_ERROR: "An error occurred during fetching manager by ID",
  CREATE_MANAGER_ERROR: "An error occurred during creating manager",
  UPDATE_MANAGER_ERROR: "An error occurred during updating manager",
  DELETE_MANAGER_ERROR: "An error occurred during deleting manager",

  FETCH_STAFF_ERROR: "An error occurred during fetching staff",
  CREATE_STAFF_ERROR: "An error occurred during creating staff",
  UPDATE_STAFF_ERROR: "An error occurred during updating staff",
  DELETE_STAFF_ERROR: "An error occurred during deleting staff",
  FETCH_STAFF_BY_ID_ERROR: "An error occurred during fetching staff by ID",
} as const;

export const BIDDING_MESSAGE = {
  ERROR_LOADING_BIDDING_HISTORY: "Error loading bidding history.",
  CONGRATULATION_WINNING_BID:
    "Congratulations! You've won the auction. Redirecting to order page...",
} as const;

export const GENERAL_TOAST_MESSAGE = {
  UNEXPECTED_ERROR: "An unexpected error occurred.",
  PLEASE_LOGIN_TO_ACCESS_THIS_FEATURE: "Please login to access this feature!",
  FAILED_TO_LOAD_AUCTION_DETAILS:
    "Failed to load auction details. Please try again.",
  FAILED_TO_LOAD_BANKS_LIST: "Failed to load banks list.",
  AMOUNT_MUST_BE_GREATER_THAN_ZERO: "Amount must be greater than 0.",
  PLEASE_SELECT_BANK: "Please select a bank.",
  FAILED_TO_CREATE_PAYMENT_URL: "Failed to create payment URL.",
  DRAW_OUT_REQUEST_CREATED_SUCCESSFULLY:
    "Draw-out request created successfully.",
} as const;

export const VALIDATION_MESSAGE = {
  ENTER_VALID_OTP_6_DIGIT: "Please enter a valid 6-digit OTP.",
} as const;

export const OTP_TOAST_MESSAGE = {
  INVALID_OTP: "Please enter a valid OTP.",
  FAILED_TO_SEND_OTP: "Failed to send OTP.",
  OTP_SENT: "OTP sent successfully!",
  OTP_RESEND: "OTP resent successfully!",
  OTP_VERIFIED: "OTP verified successfully!",
} as const;

export const LOGIN_FORM_TOAST_MESSAGE = {
  INVALID_EMAIL_FORGOT_PASSWORD_FORMAT:
    "Please enter a valid email address to reset your password.",
} as const;
