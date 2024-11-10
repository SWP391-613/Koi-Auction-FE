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
  //"Error fetching kois"
  FETCH_KOI_ERROR: "Error fetching kois",
} as const;

export const VALIDATION_MESSAGE = {
  ENTER_VALID_OTP_6_DIGIT: "Please enter a valid 6-digit OTP.",
} as const;
