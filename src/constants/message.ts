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
