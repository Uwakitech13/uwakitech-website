document.getElementById("year").textContent = new Date().getFullYear();
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

// Replace this placeholder with the business WhatsApp number, including country code.
// Example format: 2348012345678 (do not include + or spaces).
const UWAKITECH_WHATSAPP_NUMBER = "";
const whatsappLink = document.getElementById("whatsappLink");
if (UWAKITECH_WHATSAPP_NUMBER) {
  whatsappLink.href = `https://wa.me/${UWAKITECH_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Uwakitech, I would like to make an enquiry.")}`;
} else {
  whatsappLink.addEventListener("click", event => {
    event.preventDefault();
    alert("The WhatsApp contact number will be added before launch.");
  });
}
