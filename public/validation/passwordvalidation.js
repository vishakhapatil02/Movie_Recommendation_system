// public/js/passwordvalidation.js

function validatePassword(password) {
  if (!password || password.trim() === "") {
    return "⚠ Password is required.";
  }

  if (password.length < 8) {
    return "⚠ Password must be at least 8 characters long.";
  }

  const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

  if (!strongPattern.test(password)) {
    return "⚠ Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  return "";
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword || confirmPassword.trim() === "") {
    return "⚠ Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "⚠ Password and confirm password do not match.";
  }

  return "";
}
