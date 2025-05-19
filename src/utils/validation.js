export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email is required";
  }
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return "";
};

export const validateOTP = (otp) => {
  if (!otp) {
    return "OTP is required";
  }
  if (otp.length !== 6) {
    return "OTP must be 6 digits";
  }
  if (!/^\d+$/.test(otp)) {
    return "OTP must contain only numbers";
  }
  return "";
};
