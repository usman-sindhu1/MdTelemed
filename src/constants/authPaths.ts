/** Patient app auth — all routes use `/api/auth` prefix (see server docs). */
export const AUTH_API_PREFIX = '/api/auth';

export const authPaths = {
  signup: `${AUTH_API_PREFIX}/signup`,
  verifySignupOtp: `${AUTH_API_PREFIX}/verify-signup-otp`,
  login: `${AUTH_API_PREFIX}/login`,
  resetPassword: `${AUTH_API_PREFIX}/reset-password`,
  resendOtp: `${AUTH_API_PREFIX}/resend-otp`,
  verifyResetPasswordOtp: `${AUTH_API_PREFIX}/verify-reset-password-otp`,
  newPassword: `${AUTH_API_PREFIX}/new-password`,
  changePassword: `${AUTH_API_PREFIX}/change-password`,
} as const;
