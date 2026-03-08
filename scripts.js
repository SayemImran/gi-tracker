// Login feature
const checker = (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    alert("Success!!");
    window.location.href = "./apiPage.html";
  } else {
    alert("Credential Error");
  }
};