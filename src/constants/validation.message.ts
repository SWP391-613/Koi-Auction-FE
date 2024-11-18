export const LOGIN_VALIDATION_MESSAGE = {
  EMAIL_IS_REQUIRED: "Email is required",
  INVALID_EMAIL: "Invalid email address",
  PASSWORD_IS_REQUIRED: "Password is required",
} as const;

export const REGISTER_VALIDATION_MESSAGE = {
  FIRST_NAME_IS_REQUIRED: "First name is required",
  LAST_NAME_IS_REQUIRED: "Last name is required",
  EMAIL_IS_REQUIRED: "Email is required",
  INVALID_EMAIL: "Invalid email address",
  EMAIL_FORMAT: "Email must a valid email address",
  PASSWORD_IS_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long",
  PASSWORD_FORMAT:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  CONFIRM_PASSWORD_IS_REQUIRED: "Confirm Password is required",
  PASSWORD_MISMATCH: "Passwords must match",
  ACCEPT_POLICY: "You must accept the policy",
} as const;

export const FORGOT_PASSWORD_VALIDATION_MESSAGE = {
  PASSWORD_IS_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long",
  PASSWORD_FORMAT:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  CONFIRM_PASSWORD_IS_REQUIRED: "Confirm Password is required",
  PASSWORD_MISMATCH: "Passwords must match confirm password",
} as const;
