const OWNER_WHATSAPP_NUMBER = "919084220196";

let cart = [];

const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPriceEl = document.getElementById('cart-total-price');
const cartCountEl = document.querySelector('.cart-count');

if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.add('open');
        renderCart();
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('open');
    });
}

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        addToCart(name, price);
    });
});

document.querySelectorAll('[data-type="category"]').forEach(card => {
    card.addEventListener('click', () => {
        const name = card.getAttribute('data-item');
        const price = card.getAttribute('data-price');
        addToCart(name, price);
    });
});

const heroOrderBtn = document.getElementById('hero-order-btn');
if (heroOrderBtn) {
    heroOrderBtn.addEventListener('click', () => {
        addToCart('Signature Cake', 20.00);
        cartModal.classList.add('open');
        renderCart();
    });
}

const bestSellingBtn = document.getElementById('buy-best-selling');
if (bestSellingBtn) {
    bestSellingBtn.addEventListener('click', () => {
        const name = bestSellingBtn.getAttribute('data-name');
        const price = bestSellingBtn.getAttribute('data-price');
        addToCart(name, price);
        cartModal.classList.add('open');
        renderCart();
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), quantity: 1 });
    }
    updateCartBadge();
    alert(`Added ${name} to cart!`);
}

function updateCartBadge() {
    if (cartCountEl) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalCount;
    }
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalPriceEl.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div>
                <h5 style="font-size:0.9rem;">${item.name}</h5>
                <p style="font-size:0.8rem; color:#e96c28; margin:0;">$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div>
                <button onclick="changeQuantity(${index}, 1)" style="padding:2px 6px;">+</button>
                <button onclick="changeQuantity(${index}, -1)" style="padding:2px 6px;">-</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    cartTotalPriceEl.textContent = `$${total.toFixed(2)}`;
}

window.changeQuantity = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartBadge();
    renderCart();
}

const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutBtn = document.getElementById('close-checkout');
const getLocationBtn = document.getElementById('get-location-btn');

if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        cartModal.classList.remove('open');
        checkoutModal.classList.add('open');
    });
}

if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('open');
    });
}

if (getLocationBtn) {
    getLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            getLocationBtn.textContent = 'Locating...';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    document.getElementById('cust-address').value = `GPS Location: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`;
                    getLocationBtn.textContent = '📍 Done';
                },
                (error) => {
                    alert('Unable to retrieve your location. Please type manually.');
                    getLocationBtn.textContent = '📍 GPS';
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });
}

const orderForm = document.getElementById('order-form');
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cust-name').value;
        const phone = document.getElementById('cust-phone').value;
        const address = document.getElementById('cust-address').value;
        const paymentMethod = document.getElementById('payment-method').value;

        if (paymentMethod === "Online Payment") {
            alert("Online payment is currently closed. Please select Cash on Delivery.");
            return;
        }

        let orderSummary = `🍰 *New Bakery Order (COD)* 🍰\n\n`;
        let totalPrice = 0;

        cart.forEach(item => {
            let cost = item.price * item.quantity;
            totalPrice += cost;
            orderSummary += `• ${item.name} (Qty: ${item.quantity}) - $${cost.toFixed(2)}\n`;
        });

        orderSummary += `\n*Total Amount:* $${totalPrice.toFixed(2)}`;
        orderSummary += `\n\n👤 *Customer Details:*`;
        orderSummary += `\nName: ${name}`;
        orderSummary += `\nPhone: ${phone}`;
        orderSummary += `\nLocation/Address: ${address}`;
        orderSummary += `\nPayment: ${paymentMethod}`;

        const encodedMessage = encodeURIComponent(orderSummary);
        const whatsappURL = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');

        cart = [];
        updateCartBadge();
        orderForm.reset();
        checkoutModal.classList.remove('open');
        if(getLocationBtn) getLocationBtn.textContent = '📍 GPS';
    });
}