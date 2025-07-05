// public/js/namevalidation.js

function validateName(name) {
  if (!name || name.trim() === "") {
    return "⚠ Full name is required.";
  }

  const namePattern = /^[A-Za-z\s]+$/;

  if (!namePattern.test(name.trim())) {
    return "⚠ Name must contain only alphabets and spaces. No numbers or special characters allowed.";
  }

  return "";
}
