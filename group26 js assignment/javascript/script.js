
const products = [
    {id: 1, name: " Macbook Laptop", price: 4670, category: "Electronics", image: "images/macbook.jpg"},
    {id: 2, name: "Phone", price: 5879, category: "Electronics", image: "images/iphone.jpg"},
    {id: 3, name: "Shoes", price: 567, category: "Fashion", image: "images/shoe.jpg"},
    {id: 4, name: "Clothes", price: 900, category: "Fashion", image: "images/tshirt.jpg"},
    {id: 5, name: "Novel Book", price: 600, category: "Books", image: "images/clean.jpg"},
    {id: 6, name: "headphone", price: 700, category: "Electronics", image: "images/headphone.jpg"}
];

let cart = [];

function loadCart() {
    try {
        const saved = localStorage.getItem("cart");
        if (saved) {
            cart = JSON.parse(saved);

            if (!Array.isArray(cart) || !cart.every(item => item && typeof item.id !== 'undefined' && (item.qty || 0) > 0)) {
                console.warn("Invalid cart data, resetting to empty");
                cart = [];
            }
        }
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        cart = []; // Reset on error
    }
    console.log("Cart loaded:", cart.length, "items");
    updateCartCount(); // Update DOM count
}

// Save cart to localStorage 
function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
        alert("Failed to save cart. Please try again.");
    }
    updateCartCount();
}

// Update cart 
function updateCartCount() {
    const countEl = document.getElementById("cartCount");
    if (countEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        countEl.textContent = `Cart (${totalItems})`;
        console.log("Cart count updated to:", totalItems);
    }
}
//displaying items
function displayProducts(items = products) {
    const productList = document.getElementById("productList");
    if (!productList) return;
    productList.innerHTML = ""; // Clearing
    items.forEach(product => {
        const div = document.createElement("div"); // createElement
        div.className = "product-card";
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toLocaleString()}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(div); // appendChild
    });
}

// Add to cart by id 
function addToCart(id) {
    console.log("Add to cart clicked for id:", id);
    try {
        const product = products.find(p => p.id === id);
        console.log("Found product:", product);
        if (!product) throw new Error("Product not found");
        
        const cartItem = cart.find(item => item.id === id);
        if (cartItem) {
            cartItem.qty += 1;
        } else {
            cart.push({...product, qty: 1});
        }
        saveCart(); // Persist and update count
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add item to cart.");
    }
}

// Search products (
function setupSearch() {
    const search = document.getElementById("search");
    if (search) {
        search.addEventListener("input", (e) => { // addEventListener
            const text = e.target.value.toLowerCase();
            const filtered = products.filter(p => p.name.toLowerCase().includes(text));
            displayProducts(filtered);
        });
    }
}

// Filter by category (
function filterProducts(category) {
    let filtered;
    if (category === "All") {
        filtered = products;
    } else {
        filtered = products.filter(p => p.category === category);
    }
    displayProducts(filtered);
}

// Display cart with quantity controls
function displayCart() {
    const cartItems = document.getElementById("cartItems");
    const totalEl = document.getElementById("totalPrice");
    if (!cartItems || !totalEl) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="80">
            <span>${item.name} - $${item.price.toLocaleString()} x </span>
            <div class="quantity">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <button onclick="removeItem(${item.id})">Remove</button>
            <p>Subtotal: $${(item.price * item.qty).toLocaleString()}</p>
        `;
        cartItems.appendChild(div);
        total += item.price * item.qty;
    });

    totalEl.textContent = `Total: $${total.toLocaleString()}`;
}

// Change quantity with validation (try-catch)
function changeQuantity(id, delta) {
    try {
        const item = cart.find(c => c.id === id);
        if (!item) throw new Error("Item not found in cart");
        item.qty = Math.max(1, item.qty + delta); // Prevent qty < 1
        if (item.qty === 0) removeItem(id);
        else saveCart();
        displayCart(); // Refresh DOM
    } catch (error) {
        console.error("Error changing quantity:", error);
        alert("Invalid quantity change.");
    }
}

// Remove item by id
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    displayCart();
}

// Checkout validation 
function validateCheckout() {
    try {
        const name = document.getElementById("name")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const address = document.getElementById("address")?.value.trim();

        // Check empty fields
        if (!name || !email || !phone || !address) {
            throw new Error("Please fill all fields.");
        }

        // Phone validation 
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("Invalid phone number (at least 10 digits).");
        }

        // Empty cart check
        loadCart(); 
        if (cart.length === 0) {
            throw new Error("Cart is empty. Add items before checkout.");
        }

        alert("Order placed successfully! Cart cleared.");
        cart = [];
        saveCart();
        return true;
    } catch (error) {
        console.error("Checkout error:", error);
        alert(error.message);
        return false;
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    if (document.getElementById("productList")) {
        displayProducts();
        setupSearch();
    }
    if (document.getElementById("cartItems")) {
        displayCart();
    }
    updateCartCount();
});

