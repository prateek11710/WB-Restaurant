/* ==========================================================================
   Spice & Charcoal Restaurant App Engine
   Interactive menu, responsive cart system, checkout, and order tracking
   ========================================================================== */

// 1. Menu Database (Using natural photography from Unsplash)
const MENU_ITEMS = [
    {
        id: "samosa",
        name: "Crispy Veg Samosa",
        description: "Golden fried pastry shells stuffed with spiced potatoes, green peas, and roasted cumin. Served with tangy mint & tamarind chutneys (2 Pcs).",
        price: 6.99,
        category: "starters",
        spiceLevel: "mild",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "tandoori-chicken",
        name: "Smoked Tandoori Chicken",
        description: "Succulent chicken thighs marinated in hand-ground spices and yogurt, skewered and cooked in our charcoal tandoor until tender and charred.",
        price: 13.99,
        category: "starters",
        spiceLevel: "hot",
        image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "paneer-tikka",
        name: "Paneer Tikka Shaslik",
        description: "Grilled cubes of artisan cottage cheese, bell peppers, and red onions marinated in mustard oil, fenugreek, and tandoori spices.",
        price: 11.99,
        category: "starters",
        spiceLevel: "medium",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "butter-chicken",
        name: "Royal Butter Chicken",
        description: "Tender tandoori chicken pieces simmered in a velvety, buttery tomato gravy enriched with fresh cream and dried fenugreek leaves.",
        price: 17.99,
        category: "mains",
        spiceLevel: "medium",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "chicken-biryani",
        name: "Hyderabadi Dum Biryani",
        description: "Fragrant basmati rice layered with juicy spiced chicken, saffron, mint, and caramelized onions, slow-cooked under steam (Dum).",
        price: 18.99,
        category: "mains",
        spiceLevel: "hot",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "paneer-makhani",
        name: "Shahi Paneer Makhani",
        description: "Fresh cubes of house-made paneer swimming in an aromatic, rich, cream-laden tomato cashew gravy with mild kitchen spices.",
        price: 15.99,
        category: "mains",
        spiceLevel: "mild",
        image: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "dal-makhani",
        name: "Slow-Cooked Dal Makhani",
        description: "Black lentils and red kidney beans simmered overnight with tomatoes, ginger, and garlic, finished with pure butter and cream.",
        price: 13.99,
        category: "mains",
        spiceLevel: "mild",
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "garlic-naan",
        name: "Tandoori Garlic Naan",
        description: "Soft flatbread leavened and baked against the wall of our traditional clay tandoor oven, brushed liberally with minced garlic and butter.",
        price: 3.99,
        category: "sides",
        spiceLevel: "mild",
        image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "butter-naan",
        name: "Tandoori Butter Naan",
        description: "Classic soft and fluffy flatbread hand-stretched and cooked inside our clay tandoor, finished with premium salted butter.",
        price: 3.49,
        category: "sides",
        spiceLevel: "mild",
        image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?auto=format&fit=crop&w=600&q=80" // Shared visual for bread
    },
    {
        id: "gulab-jamun",
        name: "Warm Gulab Jamun",
        description: "Delectable milk-solid dumplings, deep-fried to a golden brown and soaked in hot cardamom and saffron sugar syrup (3 Pcs).",
        price: 5.99,
        category: "desserts",
        spiceLevel: "mild",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "rasmalai",
        name: "Saffron Rasmalai",
        description: "Delicate cheese patties soaked in sweetened, thickened milk flavored with cardamom, saffron, and garnished with pistachios (2 Pcs).",
        price: 6.99,
        category: "desserts",
        spiceLevel: "mild",
        image: "https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "mango-lassi",
        name: "Royal Mango Lassi",
        description: "Creamy, refreshing yogurt drink blended with sweet Alphonso mango pulp, a touch of cardamom, and garnished with crushed pistachios.",
        price: 4.99,
        category: "beverages",
        spiceLevel: "mild",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "masala-chai",
        name: "Artisanal Masala Chai",
        description: "Slow-brewed Assam black tea infused with ginger, green cardamom, cloves, cinnamon, and fresh milk. Served steaming hot.",
        price: 3.49,
        category: "beverages",
        spiceLevel: "medium",
        image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80"
    }
];

// State variables
let cart = [];
let currentCategory = "all";
let searchQuery = "";
let paymentMethod = "card";

// DOM Elements
const menuGrid = document.getElementById("menuGrid");
const categoryTabs = document.getElementById("categoryTabs");
const menuSearch = document.getElementById("menuSearch");
const clearSearchBtn = document.getElementById("clearSearch");

const cartTrigger = document.getElementById("cartTrigger");
const cartDrawer = document.getElementById("cartDrawer");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
const startOrderingBtn = document.getElementById("startOrderingBtn");

const cartBadge = document.getElementById("cartBadge");
const cartEmptyState = document.getElementById("cartEmptyState");
const cartItemsList = document.getElementById("cartItemsList");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTax = document.getElementById("cartTax");
const cartGrandTotal = document.getElementById("cartGrandTotal");
const cartDrawerFooter = document.getElementById("cartDrawerFooter");

const proceedToCheckoutBtn = document.getElementById("proceedToCheckoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
const checkoutForm = document.getElementById("checkoutForm");
const submitOrderBtn = document.getElementById("submitOrderBtn");

const payTabBtns = document.querySelectorAll(".pay-tab-btn");
const paymentDetailsPanels = document.querySelectorAll(".payment-details-panel");

const summaryItemsList = document.getElementById("summaryItemsList");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryTax = document.getElementById("summaryTax");
const summaryGrandTotal = document.getElementById("summaryGrandTotal");

const successModal = document.getElementById("successModal");
const successCustName = document.getElementById("successCustName");
const successOrderId = document.getElementById("successOrderId");
const successCloseBtn = document.getElementById("successCloseBtn");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    loadCartFromStorage();
    renderMenu();
    updateCartUI();
    setupEventListeners();
});

// Load cart from LocalStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem("sc_cart");
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
}

// Save cart to LocalStorage
function saveCartToStorage() {
    localStorage.setItem("sc_cart", JSON.stringify(cart));
}

// ==========================================================================
// Menu Rendering and Filtering
// ==========================================================================

function getSpiceBadge(spiceLevel) {
    switch (spiceLevel) {
        case "mild":
            return `<span class="menu-card-badge badge-mild"><i class="fa-solid fa-leaf"></i> Mild</span>`;
        case "medium":
            return `<span class="menu-card-badge badge-medium"><i class="fa-solid fa-pepper-hot"></i> Medium</span>`;
        case "hot":
            return `<span class="menu-card-badge badge-hot"><i class="fa-solid fa-fire"></i> Hot</span>`;
        case "extra-hot":
            return `<span class="menu-card-badge badge-extra-hot"><i class="fa-solid fa-fire-flame-curved"></i> Extra Hot</span>`;
        default:
            return "";
    }
}

function renderMenu() {
    // Show skeletons first (simulation of loading for smooth UX)
    menuGrid.innerHTML = `
        <div class="menu-skeleton"></div>
        <div class="menu-skeleton"></div>
        <div class="menu-skeleton"></div>
        <div class="menu-skeleton"></div>
    `;

    setTimeout(() => {
        // Filter menu items
        const filteredItems = MENU_ITEMS.filter(item => {
            const matchesCategory = currentCategory === "all" || item.category === currentCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        // If no results, show empty state
        if (filteredItems.length === 0) {
            menuGrid.innerHTML = `
                <div class="menu-empty-state">
                    <i class="fa-regular fa-face-frown"></i>
                    <h3>No Delicacies Found</h3>
                    <p>We couldn't find anything matching your search. Try searching for other items!</p>
                </div>
            `;
            return;
        }

        // Render card markup
        menuGrid.innerHTML = filteredItems.map(item => {
            const cartItem = cart.find(i => i.id === item.id);
            const inCart = !!cartItem;
            
            // Build card footer depending on if item is already added to cart
            const footerContent = inCart 
                ? `
                    <div class="card-qty-control">
                        <button class="qty-btn" onclick="adjustItemQty('${item.id}', -1)" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>
                        <span class="qty-number">${cartItem.quantity}</span>
                        <button class="qty-btn" onclick="adjustItemQty('${item.id}', 1)" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>
                    </div>
                  `
                : `
                    <button class="btn btn-primary btn-add-cart" onclick="addItemToCart('${item.id}')" style="width: 100%;">
                        Add to Cart <i class="fa-solid fa-plus"></i>
                    </button>
                  `;

            return `
                <div class="menu-card" data-id="${item.id}">
                    <div class="menu-card-image-box">
                        <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy">
                        ${getSpiceBadge(item.spiceLevel)}
                    </div>
                    <div class="menu-card-body">
                        <div class="menu-card-header">
                            <h3 class="menu-card-title">${item.name}</h3>
                            <span class="menu-card-price">$${item.price.toFixed(2)}</span>
                        </div>
                        <p class="menu-card-description">${item.description}</p>
                        <div class="menu-card-footer">
                            ${footerContent}
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }, 300);
}

// ==========================================================================
// Cart Operations
// ==========================================================================

function addItemToCart(itemId) {
    const item = MENU_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const existingItem = cart.find(i => i.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();
    renderMenu(); // Re-render menu cards to show quantity toggles
    
    // Animate cart badge
    cartBadge.classList.remove("pop");
    void cartBadge.offsetWidth; // Trigger reflow
    cartBadge.classList.add("pop");
}

function adjustItemQty(itemId, amount) {
    const cartItem = cart.find(i => i.id === itemId);
    if (!cartItem) return;

    cartItem.quantity += amount;
    if (cartItem.quantity <= 0) {
        cart = cart.filter(i => i.id !== itemId);
    }

    saveCartToStorage();
    updateCartUI();
    renderMenu();
}

function deleteItemFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    saveCartToStorage();
    updateCartUI();
    renderMenu();
}

function updateCartUI() {
    // Total count of items
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.innerText = totalCount;
    cartBadge.style.display = totalCount > 0 ? "flex" : "none";

    // Handle cart panels display
    if (cart.length === 0) {
        cartEmptyState.style.display = "flex";
        cartItemsList.style.display = "none";
        cartDrawerFooter.style.display = "none";
        
        // Disable proceed to checkout btn
        proceedToCheckoutBtn.disabled = true;
    } else {
        cartEmptyState.style.display = "none";
        cartItemsList.style.display = "flex";
        cartDrawerFooter.style.display = "block";
        proceedToCheckoutBtn.disabled = false;

        // Render Cart Items
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-img-box">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="adjustItemQty('${item.id}', -1)" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>
                        <span class="qty-number">${item.quantity}</span>
                        <button class="qty-btn" onclick="adjustItemQty('${item.id}', 1)" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <button class="delete-item-btn" onclick="deleteItemFromCart('${item.id}')" aria-label="Remove item"><i class="fa-regular fa-trash-can"></i> Remove</button>
                </div>
            </div>
        `).join("");
    }

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax; // Free delivery

    cartSubtotal.innerText = `$${subtotal.toFixed(2)}`;
    cartTax.innerText = `$${tax.toFixed(2)}`;
    cartGrandTotal.innerText = `$${total.toFixed(2)}`;

    // Update modal elements as well
    summarySubtotal.innerText = `$${subtotal.toFixed(2)}`;
    summaryTax.innerText = `$${tax.toFixed(2)}`;
    summaryGrandTotal.innerText = `$${total.toFixed(2)}`;
    submitOrderBtn.innerText = `Place Premium Order ($${total.toFixed(2)})`;
    
    // Render summary list inside checkout modal
    summaryItemsList.innerHTML = cart.map(item => `
        <div class="summary-item-row">
            <span class="item-qty-name">${item.quantity}x ${item.name}</span>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join("");
}

// ==========================================================================
// Form Validation & Payments
// ==========================================================================

function switchPaymentMethod(method) {
    paymentMethod = method;
    
    // Update active class on tab buttons
    payTabBtns.forEach(btn => {
        if (btn.getAttribute("data-method") === method) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Display correct fields panel
    paymentDetailsPanels.forEach(panel => {
        if (panel.id === `${method}DetailsPanel`) {
            panel.classList.add("active");
        } else {
            panel.classList.remove("active");
        }
    });

    // Make inputs required based on method
    const cardInputs = document.querySelectorAll("#cardDetailsPanel input");
    const upiInputs = document.querySelectorAll("#upiDetailsPanel input");

    if (method === "card") {
        cardInputs.forEach(i => i.required = true);
        upiInputs.forEach(i => i.required = false);
    } else if (method === "upi") {
        cardInputs.forEach(i => i.required = false);
        upiInputs.forEach(i => i.required = true);
    } else {
        cardInputs.forEach(i => i.required = false);
        upiInputs.forEach(i => i.required = false);
    }
}

// Simple Card Formatting helpers
document.getElementById("cardNumber").addEventListener("input", (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
        e.target.value = parts.join(' ');
    } else {
        e.target.value = value;
    }
});

document.getElementById("cardExpiry").addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
        e.target.value = value.substring(0, 2) + "/" + value.substring(2, 4);
    } else {
        e.target.value = value;
    }
});

// ==========================================================================
// Order Tracking Simulator (State Machine)
// ==========================================================================

function runOrderTracking(custName) {
    const trackerFill = document.getElementById("trackerFill");
    const steps = [
        document.getElementById("step1"),
        document.getElementById("step2"),
        document.getElementById("step3"),
        document.getElementById("step4")
    ];
    const statusText = document.getElementById("trackerStatusText");
    const spinner = document.getElementById("trackerSpinner");

    // Initialize tracking state
    document.getElementById("successCustName").innerText = custName;
    document.getElementById("successOrderId").innerText = `#SAC-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Reset tracker animation elements
    trackerFill.style.width = "0%";
    steps.forEach((step, idx) => {
        step.classList.remove("active", "completed");
        if (idx === 0) step.classList.add("active");
    });
    spinner.className = "fa-solid fa-rotate spin text-red";
    statusText.innerText = "Processing checkout & verifying payment...";

    // Stage 1: Confirmed (after 1s)
    setTimeout(() => {
        steps[0].classList.add("completed");
        steps[1].classList.add("active");
        trackerFill.style.width = "33%";
        statusText.innerText = "Order confirmed! The kitchen is gathering fresh spices and starting preparation...";
    }, 2000);

    // Stage 2: Cooking (after 6s)
    setTimeout(() => {
        steps[1].classList.add("completed");
        steps[2].classList.add("active");
        trackerFill.style.width = "66%";
        statusText.innerText = "Chefs have loaded your feast into the charcoal clay tandoor. Smells amazing!";
    }, 7000);

    // Stage 3: Out for Delivery (after 12s)
    setTimeout(() => {
        steps[2].classList.add("completed");
        steps[3].classList.add("active");
        trackerFill.style.width = "100%";
        statusText.innerText = "Delicacies are packed in insulated premium cases. Our driver is speed-racing to your house!";
    }, 13000);

    // Stage 4: Arrived (after 18s)
    setTimeout(() => {
        steps[3].classList.add("completed");
        spinner.className = "fa-solid fa-circle-check text-green";
        statusText.innerText = "Ding-Dong! Your hot, premium Indian dining feast has arrived! Bon appétit!";
    }, 18000);
}

// ==========================================================================
// Event Listeners
// ==========================================================================
function setupEventListeners() {
    // 1. Mobile navigation menu toggle
    mobileMenuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        const isOpened = navMenu.classList.contains("active");
        mobileMenuBtn.innerHTML = isOpened 
            ? `<i class="fa-solid fa-xmark"></i>` 
            : `<i class="fa-solid fa-bars"></i>`;
    });

    // Close menu on link click (mobile)
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            navMenu.classList.remove("active");
            mobileMenuBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
            
            // Set active class
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // 2. Menu Search filter
    menuSearch.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        if (searchQuery.trim().length > 0) {
            clearSearchBtn.classList.add("active");
        } else {
            clearSearchBtn.classList.remove("active");
        }
        renderMenu();
    });

    // Clear search
    clearSearchBtn.addEventListener("click", () => {
        menuSearch.value = "";
        searchQuery = "";
        clearSearchBtn.classList.remove("active");
        renderMenu();
    });

    // 3. Menu Category filter tabs
    categoryTabs.addEventListener("click", (e) => {
        if (!e.target.classList.contains("tab-btn")) return;
        
        // Remove active class from all tabs, add to clicked
        const tabBtns = categoryTabs.querySelectorAll(".tab-btn");
        tabBtns.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");

        currentCategory = e.target.getAttribute("data-category");
        renderMenu();
    });

    // 4. Cart drawer open/close
    cartTrigger.addEventListener("click", () => {
        cartDrawer.classList.add("active");
    });
    closeCartBtn.addEventListener("click", () => {
        cartDrawer.classList.remove("active");
    });
    cartDrawerOverlay.addEventListener("click", () => {
        cartDrawer.classList.remove("active");
    });
    startOrderingBtn.addEventListener("click", () => {
        cartDrawer.classList.remove("active");
        document.getElementById("menu").scrollIntoView();
    });

    // 5. Checkout Modal triggers
    proceedToCheckoutBtn.addEventListener("click", () => {
        cartDrawer.classList.remove("active");
        checkoutModal.classList.add("active");
        // Preset default card billing requirements
        switchPaymentMethod("card");
    });

    closeCheckoutBtn.addEventListener("click", () => {
        checkoutModal.classList.remove("active");
    });

    // Payment tab selectors
    payTabBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const method = btn.getAttribute("data-method");
            switchPaymentMethod(method);
        });
    });

    // 6. Submit Order Form Action
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Retrieve delivery details
        const nameInput = document.getElementById("custName").value;
        
        // Close checkout modal, clear cart, reset form
        checkoutModal.classList.remove("active");
        
        // Open Success Tracking Modal
        successModal.classList.add("active");
        
        // Start simulation state machine
        runOrderTracking(nameInput);
        
        // Empty shopping cart state
        cart = [];
        saveCartToStorage();
        updateCartUI();
        renderMenu();
        checkoutForm.reset();
    });

    successCloseBtn.addEventListener("click", () => {
        successModal.classList.remove("active");
    });

    // 7. Sticky Header scroll styling
    window.addEventListener("scroll", () => {
        const header = document.getElementById("navbar");
        if (window.scrollY > 50) {
            header.style.padding = "12px 24px";
            header.style.boxShadow = "var(--shadow-md)";
        } else {
            header.style.padding = "20px 24px";
            header.style.boxShadow = "none";
        }
    });

    // 8. Interactive Map Card Mock Click
    const mapCard = document.querySelector(".map-placeholder");
    mapCard.addEventListener("click", () => {
        alert("Spice & Charcoal Luxury Dining Location: \n123 Luxury Gastronomy Blvd, New York, NY 10001 \n\nOpening Google Maps in your browser...");
        window.open("https://maps.google.com/?q=123+Luxury+Gastronomy+Blvd+New+York", "_blank");
    });
}

// ==========================================================================
// SpiceBot AI Chatbot Engine
// ==========================================================================

function initChatbot() {
    const chatbotTrigger = document.getElementById("chatbotTrigger");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const chatbotClose = document.getElementById("chatbotClose");
    const chatbotBody = document.getElementById("chatbotBody");
    const chatbotForm = document.getElementById("chatbotForm");
    const chatbotInput = document.getElementById("chatbotInput");
    const simClosedHours = document.getElementById("simClosedHours");

    if (!chatbotTrigger || !chatbotWindow || !chatbotClose || !chatbotBody || !chatbotForm || !chatbotInput) {
        return;
    }

    // Toggle Chatbot Window
    chatbotTrigger.addEventListener("click", () => {
        chatbotWindow.classList.toggle("active");
        if (chatbotWindow.classList.contains("active")) {
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }
    });

    chatbotClose.addEventListener("click", () => {
        chatbotWindow.classList.remove("active");
    });

    // Handle Form Submit
    chatbotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = chatbotInput.value.trim();
        if (!text) return;

        appendChatMessage("user", text);
        chatbotInput.value = "";

        // Bot responds with a small typing delay for realism
        setTimeout(() => {
            const response = generateBotResponse(text);
            appendChatMessage("bot", response);
        }, 500);
    });

    function appendChatMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message", sender);
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatbotBody.appendChild(msgDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function isRestaurantClosed() {
        if (simClosedHours && simClosedHours.checked) {
            return true;
        }
        const hour = new Date().getHours();
        return (hour >= 22 || hour < 8);
    }

    function generateBotResponse(userMsg) {
        const msg = userMsg.toLowerCase().trim();
        const closed = isRestaurantClosed();

        // 1. Check if user is asking for help
        if (msg === "help" || msg.includes("what can you do") || msg.includes("commands")) {
            return `Here are some things I can do for you:<br>
            • <strong>Add items</strong>: <em>"Add 2 Butter Chicken"</em>, <em>"Add Garlic Naan"</em><br>
            • <strong>View cart</strong>: <em>"Show my cart"</em>, <em>"What is my total?"</em><br>
            • <strong>Remove items</strong>: <em>"Remove Samosa"</em><br>
            • <strong>Clear cart</strong>: <em>"Empty my cart"</em><br>
            • <strong>Checkout</strong>: <em>"Checkout now"</em>, <em>"Place order"</em><br>
            • <strong>Ask for suggestions</strong>: <em>"Recommend something spicy"</em>`;
        }

        // 2. Check if restaurant is closed and action is an order-related command
        const isOrderCommand = msg.includes("add") || msg.includes("remove") || msg.includes("delete") || 
                               msg.includes("checkout") || msg.includes("order") || msg.includes("clear") || 
                               msg.includes("empty");
        
        if (closed && isOrderCommand) {
            return `<strong>Kitchen is Closed!</strong> 🏮<br>
            Our online ordering system is offline between <strong>10:00 PM and 8:00 AM</strong>. 
            We cannot modify your cart or process checkouts at this time. 
            Please visit us tomorrow during business hours to place your order!`;
        }

        if (closed) {
            // General conversation is allowed even if closed
            if (msg.includes("recommend") || msg.includes("special") || msg.includes("good") || msg.includes("best")) {
                return `Even though our kitchen is currently closed, I can highly recommend our signature dishes for tomorrow!<br>
                • 🔥 <strong>Hyderabadi Dum Biryani</strong>: Fragrant saffron rice with spiced chicken, slow-cooked to smoky perfection.<br>
                • 👑 <strong>Royal Butter Chicken</strong>: Succulent tandoori chicken simmered in a velvety butter tomato cream gravy.<br>
                • 🥬 <strong>Paneer Tikka Shaslik</strong>: Perfect cottage cheese starter grilled in our charcoal tandoor.`;
            }
            if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey") || msg.includes("namaste")) {
                return `Namaste! 🏮 We are currently closed for the night (hours: 8:00 AM - 10:00 PM). While online ordering is offline, feel free to ask about our menu or get recommendations for tomorrow!`;
            }
            return `We are currently closed for the night (10:00 PM to 8:00 AM). 🏮 We cannot take orders right now, but feel free to browse our menu! Ask for <em>"recommendations"</em> or type <em>"help"</em> to learn more.`;
        }

        // 3. Open hours logic - process commands
        
        // ADD COMMAND
        if (msg.startsWith("add ") || msg.includes("add ")) {
            let foundItem = null;
            let qty = 1;

            // Extract quantity if present
            const numMatch = msg.match(/\b(\d+)\b/);
            if (numMatch) {
                qty = parseInt(numMatch[1]);
            }

            for (const item of MENU_ITEMS) {
                const nameLower = item.name.toLowerCase();
                const cleanName = nameLower
                    .replace("crispy ", "")
                    .replace("smoked ", "")
                    .replace("royal ", "")
                    .replace("shahi ", "")
                    .replace("slow-cooked ", "")
                    .replace("warm ", "")
                    .replace("tandoori ", "")
                    .replace("artisanal ", "")
                    .trim();
                
                if (msg.includes(cleanName) || msg.includes(item.id)) {
                    foundItem = item;
                    break;
                }
            }

            if (foundItem) {
                // Add to cart in a loop
                for (let i = 0; i < qty; i++) {
                    addItemToCart(foundItem.id);
                }
                return `Excellent choice! 🌶️ I have added <strong>${qty}x ${foundItem.name}</strong> to your cart.<br>
                Your grand total is now <strong>${cartGrandTotal.innerText}</strong>. You can type <em>"checkout"</em> to complete your order!`;
            } else {
                return `I couldn't find that dish on our menu. Could you please specify the item name? (e.g., <em>"Add Butter Chicken"</em>, <em>"Add 2 Garlic Naan"</em>)`;
            }
        }

        // REMOVE COMMAND
        if (msg.startsWith("remove ") || msg.includes("remove ") || msg.startsWith("delete ") || msg.includes("delete ")) {
            let foundItem = null;
            for (const item of MENU_ITEMS) {
                const nameLower = item.name.toLowerCase();
                const cleanName = nameLower
                    .replace("crispy ", "")
                    .replace("smoked ", "")
                    .replace("royal ", "")
                    .replace("shahi ", "")
                    .replace("slow-cooked ", "")
                    .replace("warm ", "")
                    .replace("tandoori ", "")
                    .replace("artisanal ", "")
                    .trim();

                if (msg.includes(cleanName) || msg.includes(item.id)) {
                    foundItem = item;
                    break;
                }
            }

            if (foundItem) {
                const inCart = cart.find(i => i.id === foundItem.id);
                if (inCart) {
                    deleteItemFromCart(foundItem.id);
                    return `I have removed <strong>${foundItem.name}</strong> from your cart. 🗑️ Your total is now ${cartGrandTotal.innerText}.`;
                } else {
                    return `<strong>${foundItem.name}</strong> is not in your cart!`;
                }
            } else {
                return `I couldn't find that dish. Which item would you like to remove? (e.g., <em>"Remove Garlic Naan"</em>)`;
            }
        }

        // SHOW CART COMMAND
        if (msg === "cart" || msg.includes("show cart") || msg.includes("view cart") || msg.includes("my cart") || msg.includes("total")) {
            if (cart.length === 0) {
                return `Your cart is currently empty! 🛒 Add something delicious by saying: <em>"Add Butter Chicken"</em>.`;
            }
            
            const itemList = cart.map(item => `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`).join("<br>");
            return `Here is your current bag: 🛒<br>
            ${itemList}<br>
            ----------------------<br>
            Grand Total (with taxes): <strong>${cartGrandTotal.innerText}</strong><br>
            Ready to eat? Type <em>"checkout"</em>!`;
        }

        // CLEAR CART COMMAND
        if (msg.includes("clear cart") || msg.includes("empty cart") || msg.includes("clear bag") || msg.includes("empty bag")) {
            if (cart.length === 0) {
                return `Your cart is already empty!`;
            }
            cart = [];
            saveCartToStorage();
            updateCartUI();
            renderMenu();
            return `I have emptied your shopping cart. Your bag is now clean! 🗑️`;
        }

        // CHECKOUT COMMAND
        if (msg === "checkout" || msg.includes("checkout") || msg.includes("order now") || msg.includes("place order") || msg.includes("pay")) {
            if (cart.length === 0) {
                return `Your cart is empty! Add some dishes from our menu first before checking out.`;
            }
            
            // Open secure checkout modal
            cartDrawer.classList.remove("active");
            checkoutModal.classList.add("active");
            switchPaymentMethod("card");
            
            return `Opening secure checkout modal for you! 💳 Please enter your delivery details and choose your payment method (Card, UPI, or Cash). Let me know if you need anything else!`;
        }

        // RECOMMENDATIONS COMMAND
        if (msg.includes("recommend") || msg.includes("best seller") || msg.includes("what is good") || msg.includes("specialty") || msg.includes("spicy")) {
            if (msg.includes("spicy") || msg.includes("hot") || msg.includes("fiery")) {
                return `For a fiery kick, I highly recommend:<br>
                • 🔥 <strong>Hyderabadi Dum Biryani</strong> ($18.99): Fragrant saffron rice layered with hot spiced chicken.<br>
                • 🍗 <strong>Smoked Tandoori Chicken</strong> ($13.99): Charcoal-charred skewered chicken marinated in mustard oil and hot spices.`;
            }
            if (msg.includes("sweet") || msg.includes("dessert") || msg.includes("mild")) {
                return `For sweet and mild options, try:<br>
                • 🍨 <strong>Warm Gulab Jamun</strong> ($5.99): Sweet milk-solid dumplings soaked in cardamom sugar syrup.<br>
                • 👑 <strong>Royal Butter Chicken</strong> ($17.99): Velvet tomato-cream curry, perfect for a mild, rich flavor.`;
            }
            return `Here are some of our guest-favorite specialties: ⭐<br>
            1. 👑 <strong>Royal Butter Chicken</strong> ($17.99) - Velvet butter curry.<br>
            2. 🔥 <strong>Hyderabadi Dum Biryani</strong> ($18.99) - Fragrant saffron spiced rice.<br>
            3. 🧄 <strong>Tandoori Garlic Naan</strong> ($3.99) - Blistered clay-oven flatbread.<br>
            4. 🍨 <strong>Warm Gulab Jamun</strong> ($5.99) - Cardamom-syrup dumplings.<br><br>
            Would you like me to add any of these? Say <em>"Add Butter Chicken"</em> to begin!`;
        }

        // GREETINGS
        if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey") || msg.includes("namaste") || msg.includes("yo")) {
            return `Namaste! 🙏 Welcome to **Spice & Charcoal**. I am **SpiceBot**, your personal dining AI.<br>
            I can help you add food to your cart, recommend dishes, show your total, or guide you to checkout. What are you craving today?`;
        }

        // FALLBACK
        return `I'm not entirely sure how to handle that request. 🌶️<br>
        I can manage your shopping cart and recommend food. Try asking:<br>
        • <em>"Add Butter Chicken and Garlic Naan"</em><br>
        • <em>"Show my cart"</em><br>
        • <em>"Recommend something spicy"</em><br>
        • <em>"Checkout"</em>`;
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
} else {
    initChatbot();
}
