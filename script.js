let products = []; // Array to store fetched products
let cart = JSON.parse(localStorage.getItem("cart")) || []; // Retrieve the cart from localStorage or initialize an empty cart

const productList = document.getElementById("products-container");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const viewCartButton = document.getElementById("view-cart");
const clearCartButton = document.getElementById("clear-cart");
const closeModal = document.querySelector(".close");
const addToCartMessage = document.getElementById("add-to-cart-message");

// Fetch products from products.json
async function fetchProducts() {
  try {
    const response = await fetch("products.json"); // Fetch the JSON file
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    products = await response.json();
    renderProducts(); // Render products after fetching
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Render Products
function renderProducts() {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = products
    .map(
      (product) => `
      <div class="product">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>$${product.price.toFixed(2)}</p>
          <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `
    )
    .join("");
}

// Add to Cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  showMessage(`${product.name} has been added to cart`);

  updateCart();
  saveCartToLocalStorage();
}

// Show Add-to-Cart Message
function showMessage(message) {
  addToCartMessage.textContent = message;
  addToCartMessage.style.display = "block";
  setTimeout(() => {
    addToCartMessage.style.display = "none";
  }, 5000); // Hide after 5 seconds
}

// Update Cart
function updateCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
      </div>
    `
    )
    .join("");
  cartTotal.textContent = cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);
}

// Update Quantity
function updateQuantity(productId, quantity) {
  if (quantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  } else {
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) cartItem.quantity = quantity;
  }
  updateCart();
  saveCartToLocalStorage();
}

// Clear Cart
clearCartButton.addEventListener("click", () => {
  cart = [];
  updateCart();
  saveCartToLocalStorage();
});

// Open/Close Modal
viewCartButton.addEventListener("click", () => {
  cartModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  cartModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Initialize
fetchProducts(); // Fetch products when the page loads
updateCart(); // Update cart on page load
