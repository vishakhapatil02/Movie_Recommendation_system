// public/js/emailvalidation.js

function validateEmail(email) {
  if (!email || email.trim() === "") {
    return "⚠ Email is required.";
  }

  // Simple email pattern (can be extended)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return "⚠ Please enter a valid email address.";
  }

  return "";
}
