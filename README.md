# InfiniTek - Online Retail Store🛒

Welcome to **InfiniTek**, a simple and interactive e-commerce shopping cart project! This project allows users to browse products, add them to their cart, and manage their cart items seamlessly. It’s built using **HTML**, **CSS**, and **JavaScript**, with a focus on user experience and interactivity.

---

## 🌟 Features

- **Product Listing**: Display a list of products fetched from a `products.json` file.
- **Add to Cart**: Add products to the cart with a single click.
- **Cart Management**: View, update, and remove items from the cart.
- **Persistent Cart**: Cart data is saved in `localStorage`, so it persists even after refreshing the page.
- **Responsive Design**: The layout is responsive and works well on both desktop and mobile devices.
- **Interactive UI**: Smooth animations and transitions for a better user experience.

---

## 🛠️ Project Structure

The project consists of the following files:

- **`index.html`**: The main HTML file that structures the webpage.
- **`style.css`**: Contains all the styles for the project.
- **`script.js`**: Handles all the logic, including fetching products, managing the cart, and updating the UI.
- **`products.json`**: A JSON file containing product data (name, description, price, and image).

---

## 🚀 How to Run the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/MehediHasan-ds/WebDev-Projects.git
   ```

2. **Open the Project**:
   - Open the `index.html` file in your browser.
   - Alternatively, you can use a live server extension in your code editor (e.g., VS Code) to run the project.

3. **Explore the Project**:
   - Browse the products.
   - Add items to the cart.
   - View and manage your cart using the "View Cart" button.

---

## 🧩 How It Works

### 1. **Fetching Products**
   - The `script.js` file fetches product data from the `products.json` file using the `fetch` API.
   - Products are dynamically rendered on the page using JavaScript.

### 2. **Adding to Cart**
   - When a user clicks the "Add to Cart" button, the product is added to the cart.
   - The cart is stored in `localStorage`, so it persists even after refreshing the page.

### 3. **Updating the Cart**
   - Users can increase or decrease the quantity of items in the cart.
   - The total price is automatically calculated and displayed.

### 4. **Clearing the Cart**
   - Users can clear the entire cart by clicking the "Clear Cart" button.

### 5. **Interactive UI**
   - A fixed "View Cart" button is always visible for easy access.
   - A modal displays the cart contents, and users can close it by clicking outside the modal or the close button.

---

## 🎨 Styling Highlights

- **Responsive Design**: The product grid adjusts based on screen size.
- **Hover Effects**: Product cards lift and cast a shadow when hovered.
- **Animations**: Smooth slide-in and fade-out animations for the "Add to Cart" message.
- **Fixed Cart Button**: The "View Cart" button is fixed at the bottom-right corner for easy access.

---

## 📂 File Details

### `index.html`
- Contains the structure of the webpage, including the product list, cart modal, and buttons.

### `style.css`
- Defines the styles for the product cards, buttons, modal, and animations.

### `script.js`
- Handles all the logic:
  - Fetching and rendering products.
  - Adding, updating, and removing items from the cart.
  - Saving and retrieving cart data from `localStorage`.

### `products.json`
- Contains an array of product objects with the following properties:
  - `id`: Unique identifier for the product.
  - `name`: Name of the product.
  - `description`: Short description of the product.
  - `price`: Price of the product.
  - `image`: Path to the product image.

---

## 🛒 Sample Product Data

Here’s an example of the product data stored in `products.json`:

```json
[
  {
    "id": 1,
    "name": "ASUS TUF Gaming F15 FX507ZC4-HN065",
    "description": "16GB RAM,512GB NVMe",
    "price": 1200,
    "image": "./images/laptop.jpg"
  },
  {
    "id": 2,
    "name": "Samsung Galaxy S23 Ultra 5G",
    "description": "12GB LPDDR5X,256GB UFS 3.1",
    "price": 800,
    "image": "./images/smartphone2.jpeg"
  },
  {
    "id": 3,
    "name": "Soundcore by Anker Q20i",
    "description": "Up to 30 hours (ANC On), 40 hours (ANC Off)",
    "price": 150,
    "image": "./images/headphone.jpg"
  }
]
```

---

## 🛠️ Technologies Used

- **HTML**: For structuring the webpage.
- **CSS**: For styling and animations.
- **JavaScript**: For interactivity and cart management.
- **LocalStorage**: For persisting cart data.

---

## 📝 Future Enhancements

- Add a checkout page.
- Integrate with a backend to fetch real-time product data.
- Implement user authentication and order history.

---

## 🙏 Credits

- Developed by **Mehedi Hasan**.
- Inspired by modern e-commerce websites.

---

Enjoy exploring **InfiniTek**! If you have any questions or suggestions, feel free to reach out. 😊
```

---
