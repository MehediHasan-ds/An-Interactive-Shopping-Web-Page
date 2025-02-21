let products = [];
let selectedSpecs = JSON.parse(localStorage.getItem("selectedSpecs")) || {};
let specificationsData = []; // To store predefined specifications

const searchInput = document.getElementById("search-input");
const productSpecsList = document.getElementById("product-specs-list");
const addProductBtn = document.getElementById("add-product-btn");
const addProductModal = new bootstrap.Modal(document.getElementById("add-product-modal"));
const addAnotherModal = new bootstrap.Modal(document.getElementById("add-another-modal"));
const addProductForm = document.getElementById("add-product-form");
const specificationFields = document.getElementById("specification-fields");
const addSpecFieldBtn = document.getElementById("add-spec-field");
const confirmAddProductBtn = document.getElementById("confirm-add-product");
const addAnotherBtn = document.getElementById("add-another-btn");
const productCategory = document.getElementById("product-category");
const productSubcategory = document.getElementById("product-subcategory");

// Function to get the CSRF token from cookies
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

const csrfToken = getCookie('csrftoken'); // Get CSRF token

// Fetch products and specifications
async function fetchData() {
  try {
    const [productsResponse, specsResponse] = await Promise.all([
      fetch(`${productsJsonUrl}?${Date.now()}`, { cache: 'no-cache' }),
      fetch(specificationsJsonUrl),
    ]);

    if (!productsResponse.ok || !specsResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    products = await productsResponse.json();
    specificationsData = (await specsResponse.json()).products;

    populateCategories();
    renderProductSpecs(products);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Failed to fetch data. Please try again.");
  }
}

// Render product specifications in the table
function renderProductSpecs(filteredProducts) {
  const newContent = filteredProducts
    .map(
      (product) => `
      <tr>
        <td>${product.name}</td>
        <td>
          ${Object.entries(product.specifications)
            .map(
              ([key, value]) => `
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="spec-${product.id}-${key}"
                ${selectedSpecs[product.id]?.some((spec) => spec.key === key) ? "checked" : ""}
                data-product-id="${product.id}"
                data-key="${key}"
                data-value="${value}"
              >
              <label class="form-check-label" for="spec-${product.id}-${key}">${key}: ${value}</label>
            </div>
          `
            )
            .join("")}
        </td>
      </tr>
    `
    )
    .join("");

  productSpecsList.innerHTML = newContent;
}

// Event delegation for checkbox changes
productSpecsList.addEventListener("change", (event) => {
  if (event.target.matches('input[type="checkbox"]')) {
    const productId = parseInt(event.target.dataset.productId);
    const key = event.target.dataset.key;
    const value = event.target.dataset.value;

    if (!selectedSpecs[productId]) {
      selectedSpecs[productId] = [];
    }

    if (event.target.checked) {
      // Add the specification to selectedSpecs
      selectedSpecs[productId].push({ key, value });
    } else {
      // Remove the specification from selectedSpecs
      selectedSpecs[productId] = selectedSpecs[productId].filter(
        (spec) => spec.key !== key
      );
    }

    // Save selectedSpecs to localStorage
    localStorage.setItem("selectedSpecs", JSON.stringify(selectedSpecs));
  }
});

// Populate categories in the dropdown
function populateCategories() {
  const categories = [...new Set(specificationsData.map((item) => item.category))];
  productCategory.innerHTML = `
    <option value="">Select Category</option>
    ${categories.map((category) => `<option value="${category}">${category}</option>`).join("")}
  `;
}

// Populate sub-categories based on selected category
productCategory.addEventListener("change", () => {
  const category = productCategory.value;
  const subCategories = specificationsData
    .filter((item) => item.category === category)
    .map((item) => item["sub-category"]);

  productSubcategory.innerHTML = `
    <option value="">Select Sub-Category</option>
    ${subCategories.map((subCat) => `<option value="${subCat}">${subCat}</option>`).join("")}
  `;
});

// Fetch predefined specifications based on category/sub-category
productSubcategory.addEventListener("change", () => {
  const category = productCategory.value;
  const subCategory = productSubcategory.value;

  const selectedSpecs = specificationsData.find(
    (item) => item.category === category && item["sub-category"] === subCategory
  );

  if (selectedSpecs) {
    specificationFields.innerHTML = selectedSpecs.specifications
      .map(
        (spec) => `
        <div class="mb-2">
          <div class="input-group">
            <input type="text" class="form-control" value="${spec}" readonly>
            <input type="text" class="form-control" placeholder="Enter value">
          </div>
        </div>
      `
      )
      .join("");

    addSpecFieldBtn.textContent = "Add More Specifications";
  } else {
    specificationFields.innerHTML = "";
    addSpecFieldBtn.textContent = "Add Specifications";
  }
});

// Add specification field
addSpecFieldBtn.addEventListener("click", () => {
  const field = document.createElement("div");
  field.classList.add("mb-2");
  field.innerHTML = `
    <div class="input-group">
      <input type="text" class="form-control" placeholder="Field Name">
      <input type="text" class="form-control" placeholder="Field Value">
      <button type="button" class="btn btn-danger" onclick="removeField(this)">Remove</button>
    </div>
  `;
  specificationFields.appendChild(field);
});

// Remove specification field
window.removeField = (button) => {
  button.closest("div").remove();
};

// Confirm adding product
confirmAddProductBtn.addEventListener("click", async () => {
  const product = {
    id: Date.now(),
    name: document.getElementById("product-name").value,
    price: parseFloat(document.getElementById("product-price").value),
    image: "",
    description: document.getElementById("product-description").value,
    category: productCategory.value,
    subCategory: productSubcategory.value,
    specifications: {},
  };

  // Add specifications
  const fields = specificationFields.querySelectorAll(".input-group");
  fields.forEach((field) => {
    const [keyInput, valueInput] = field.querySelectorAll("input");
    product.specifications[keyInput.value || keyInput.placeholder] = valueInput.value;
  });

  // Handle image upload
  const imageFile = document.getElementById("product-image").files[0];
  if (imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const uploadResponse = await fetch("/upload-image/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
        },
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload image");

      const { imageUrl } = await uploadResponse.json();
      product.image = imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      return;
    }
  }

  // Save product
  try {
    const response = await fetch("/save-product/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error("Failed to save product");

    // Clear the form
    addProductForm.reset();
    specificationFields.innerHTML = "";

    // Show success modal
    addProductModal.hide();
    addAnotherModal.show();

    // Re-fetch and re-render products
    await fetchData(); // Fetch the latest data
    renderProductSpecs(products); // Re-render the product list
  } catch (error) {
    console.error("Error saving product:", error);
    alert("Failed to save product. Please try again.");
  }
});

// Add another product
addAnotherBtn.addEventListener("click", () => {
  addAnotherModal.hide();
  addProductModal.show();
});

// Initialize
fetchData();
addProductBtn.addEventListener("click", () => addProductModal.show());
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );
  renderProductSpecs(filteredProducts);
});