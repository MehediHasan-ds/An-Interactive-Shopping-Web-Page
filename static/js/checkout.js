let cart = JSON.parse(localStorage.getItem("cart")) || []; // Retrieve the cart from localStorage
let totalAmount = parseFloat(localStorage.getItem("totalAmount")) || 0; // Retrieve the total amount
let discount = 0; // Initialize discount

// DOM Elements
const checkoutItems = document.getElementById("checkout-items").querySelector("tbody");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutTotalAfterDiscount = document.getElementById("checkout-total-after-discount");
const promoCodeInput = document.getElementById("promo-code-input");
const applyPromoCodeButton = document.getElementById("apply-promo-code");
const promoCodeMessage = document.getElementById("promo-code-message");
const confirmBuyButton = document.getElementById("confirm-buy");
const cancelOrderButton = document.getElementById("cancel-order");

// Render Checkout Items
function renderCheckoutItems() {
  checkoutItems.innerHTML = cart
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");
  checkoutTotal.textContent = totalAmount.toFixed(2);
  checkoutTotalAfterDiscount.textContent = totalAmount.toFixed(2);
}

async function applyPromoCode() {
    const promoCode = promoCodeInput.value.trim();
    if (!promoCode) {
      promoCodeMessage.textContent = "Please enter a promo code.";
      return;
    }
  
    try {
      const response = await fetch(promoCodesJsonUrl); // Use the variable here
      if (!response.ok) {
        throw new Error("Failed to fetch promo codes");
      }
      const promoCodes = await response.json();
  
      const promo = promoCodes.find((p) => p.code === promoCode);
      if (promo) {
        discount = promo.discount;
        const discountedTotal = totalAmount * (1 - discount / 100);
        checkoutTotalAfterDiscount.textContent = discountedTotal.toFixed(2);
        promoCodeMessage.textContent = `Promo code applied: ${discount}% off!`;
      } else {
        promoCodeMessage.textContent = "Invalid promo code.";
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      promoCodeMessage.textContent = "Failed to apply promo code.";
    }
  }

// Confirm Buy
async function confirmBuy() {
    const order = {
      orderId: generateOrderId(),
      products: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        amount: item.price * item.quantity,
      })),
      totalAmount: parseFloat(checkoutTotalAfterDiscount.textContent),
    };
  
    try {
      // Send order to the Django backend
      const response = await fetch("/save-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),  // Include CSRF token for security
        },
        body: JSON.stringify(order),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save order");
      }
  
      // Clear cart and redirect
      localStorage.removeItem("cart");
      localStorage.removeItem("totalAmount");
      alert("Order confirmed! Thank you for your purchase.");
      window.location.href = "/";
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order. Please try again.");
    }
  }
  
  // Helper function to get CSRF token
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
}

// Generate Order ID
function generateOrderId() {
  return `ORD${Date.now()}`; // Use timestamp as order ID
}

// Initialize
renderCheckoutItems(); // Render checkout items when the page loads
applyPromoCodeButton.addEventListener("click", applyPromoCode);
confirmBuyButton.addEventListener("click", confirmBuy);
cancelOrderButton.addEventListener("click", () => {
  window.location.href = "index.html";
});