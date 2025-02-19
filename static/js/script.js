let products = []; // Array to store fetched products
let cart = JSON.parse(localStorage.getItem("cart")) || []; // Retrieve the cart from localStorage or initialize an empty cart
let selectedSpecs = JSON.parse(localStorage.getItem("selectedSpecs")) || {}; // Retrieve selected specifications

const productsContainer = document.getElementById("products-container");
const productDetailsView = document.getElementById("product-details-view");
const productDetailImage = document.getElementById("product-detail-image");
const productDetailName = document.getElementById("product-detail-name");
const productDetailPrice = document.getElementById("product-detail-price");
const productDetailSpecifications = document.getElementById("product-detail-specifications");
const productDetailDescription = document.getElementById("product-detail-description");
const addToCartFromDetail = document.getElementById("add-to-cart-from-detail");
const goBackButton = document.getElementById("go-back");
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
    const response = await fetch(productsJsonUrl); // Use the variable here
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function renderProducts() {
  productsContainer.innerHTML = products
    .map(
      (product) => `
      <div class="product" onclick="showProductDetails(${product.id})">
        <img src="${imagesBaseUrl}${product.image}" alt="${product.name}"> <!-- Use the variable here -->
        <div class="product-info">
          <h3>${product.name}</h3>
          ${renderSelectedSpecs(product)}
          <p>$${product.price.toFixed(2)}</p>
          <button onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `
    )
    .join("");
}

function renderSelectedSpecs(product) {
  const specs = selectedSpecs[product.id] || [];
  return specs
    .map(
      (spec) => `
      <p><strong>${spec.key}:</strong> ${spec.value}</p>
    `
    )
    .join("");
}

function showProductDetails(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
  
    // Use the imagesBaseUrl variable to construct the full image path
    productDetailImage.src = `${imagesBaseUrl}${product.image}`;
    productDetailName.textContent = product.name;
    productDetailPrice.textContent = `$${product.price.toFixed(2)}`;
    productDetailDescription.textContent = product.description;
  
    productDetailSpecifications.innerHTML = Object.entries(product.specifications)
      .map(
        ([key, value]) => `
        <tr>
          <th>${key}</th>
          <td>${value}</td>
        </tr>
      `
      )
      .join("");
  
    addToCartFromDetail.onclick = () => {
      addToCart(product.id);
    };
  
    // Show product details view and hide product list
    productsContainer.style.display = "none";
    productDetailsView.style.display = "block";
    goBackButton.style.display = "block";
}

// Go Back to Product List
goBackButton.addEventListener("click", () => {
  productsContainer.style.display = "flex";
  productDetailsView.style.display = "none";
  goBackButton.style.display = "none";
});

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

function showMessage(message) {
  addToCartMessage.textContent = message;
  addToCartMessage.style.display = "block";
  setTimeout(() => {
    addToCartMessage.style.display = "none";
  }, 5000);
}

function updateCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <div class="cart-item-buttons">
          <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-amount">
          $${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    `
    )
    .join("");

  // Update total amount
  const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);
  localStorage.setItem("totalAmount", total); // Save total amount to localstorage for checkout
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

// Remove Item from Cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
  saveCartToLocalStorage();
}

clearCartButton.addEventListener("click", () => {
  cart = [];
  updateCart();
  saveCartToLocalStorage();
});

// Open/Close Cart Modal
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