// Cart Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality
    initCartFunctionality();

    // Continue Shopping button
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }

    // Update Cart button
    const updateCartBtn = document.querySelector('.update-cart');
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', function() {
            updateCart();
            showNotification('Cart updated successfully!');
        });
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            showNotification('Proceeding to checkout...', 'info');
            // In a real application, this would redirect to the checkout page
        });
    }

    // Apply promo code button
    const promoBtn = document.querySelector('.promo-input button');
    if (promoBtn) {
        promoBtn.addEventListener('click', function() {
            const promoInput = document.querySelector('.promo-input input');
            if (promoInput && promoInput.value.trim()) {
                // Check if promo code is valid (mock implementation)
                if (promoInput.value.trim().toUpperCase() === 'SUMMER25') {
                    applyDiscount(25);
                    showNotification('Promo code applied: 25% discount!', 'success');
                } else if (promoInput.value.trim().toUpperCase() === 'FREE') {
                    updateShipping(0);
                    showNotification('Free shipping applied!', 'success');
                } else {
                    showNotification('Invalid promo code. Please try again.', 'error');
                }
            } else {
                showNotification('Please enter a promo code.', 'error');
            }
        });
    }

    // Initialize suggested products
    initSuggestedProducts();
});

// Initialize cart functionality
function initCartFunctionality() {
    // Quantity buttons
    const decreaseBtns = document.querySelectorAll('.quantity-btn.decrease');
    const increaseBtns = document.querySelectorAll('.quantity-btn.increase');
    const quantityInputs = document.querySelectorAll('.item-quantity input');

    // Decrease quantity buttons
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateItemTotal(input);
            }
        });
    });

    // Increase quantity buttons
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            let value = parseInt(input.value);
            if (value < parseInt(input.max)) {
                input.value = value + 1;
                updateItemTotal(input);
            }
        });
    });

    // Quantity input change event
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Ensure value is within min and max
            let value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);

            if (isNaN(value) || value < min) {
                this.value = min;
                value = min;
            } else if (value > max) {
                this.value = max;
                value = max;
            }

            updateItemTotal(this);
        });
    });

    // Remove item buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const itemName = cartItem.querySelector('h3').textContent;

            // Animation for removal
            cartItem.style.opacity = '0';
            cartItem.style.height = '0';
            cartItem.style.overflow = 'hidden';
            cartItem.style.transition = 'opacity 0.3s ease, height 0.5s ease, padding 0.5s ease, margin 0.5s ease';
            cartItem.style.padding = '0';
            cartItem.style.margin = '0';

            setTimeout(() => {
                cartItem.remove();
                updateCartCount();
                updateCartTotals();
                showNotification(`${itemName} removed from cart.`);

                // Check if cart is empty
                const remainingItems = document.querySelectorAll('.cart-item');
                if (remainingItems.length === 0) {
                    showEmptyCartMessage();
                }
            }, 500);
        });
    });

    // Save for later buttons
    const saveButtons = document.querySelectorAll('.save-for-later');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.closest('.cart-item').querySelector('h3').textContent;
            showNotification(`${itemName} saved for later.`);
            this.innerHTML = '<i class="fas fa-heart"></i> Saved';
            this.style.color = 'var(--accent-color)';
            this.disabled = true;
        });
    });
}

// Update item total price
function updateItemTotal(input) {
    const cartItem = input.closest('.cart-item');
    const priceText = cartItem.querySelector('.item-price').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    const quantity = parseInt(input.value);
    const totalElement = cartItem.querySelector('.item-total');

    const total = price * quantity;
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Update cart totals
    updateCartTotals();
}

// Update cart totals
function updateCartTotals() {
    const itemTotals = document.querySelectorAll('.item-total');
    let subtotal = 0;

    itemTotals.forEach(item => {
        subtotal += parseFloat(item.textContent.replace('$', ''));
    });

    // Update subtotal
    const subtotalElement = document.querySelector('.summary-row:nth-child(1) span:last-child');
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

    // Get shipping cost
    const shippingElement = document.querySelector('.summary-row:nth-child(2) span:last-child');
    const shipping = parseFloat(shippingElement.textContent.replace('$', ''));

    // Calculate tax (8% of subtotal)
    const tax = subtotal * 0.08;
    const taxElement = document.querySelector('.summary-row:nth-child(3) span:last-child');
    taxElement.textContent = `$${tax.toFixed(2)}`;

    // Update total
    const total = subtotal + shipping + tax;
    const totalElement = document.querySelector('.summary-total span:last-child');
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Update shipping cost
function updateShipping(cost) {
    const shippingElement = document.querySelector('.summary-row:nth-child(2) span:last-child');
    shippingElement.textContent = `$${cost.toFixed(2)}`;
    updateCartTotals();
}

// Apply discount percentage
function applyDiscount(percentage) {
    const subtotalElement = document.querySelector('.summary-row:nth-child(1) span:last-child');
    const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
    const discount = subtotal * (percentage / 100);

    // Check if discount row already exists
    let discountRow = document.querySelector('.summary-row.discount');

    if (!discountRow) {
        // Create discount row
        discountRow = document.createElement('div');
        discountRow.classList.add('summary-row', 'discount');

        const discountLabel = document.createElement('span');
        discountLabel.textContent = `Discount (${percentage}%)`;

        const discountValue = document.createElement('span');
        discountValue.textContent = `-$${discount.toFixed(2)}`;
        discountValue.style.color = 'var(--danger-color)';

        discountRow.appendChild(discountLabel);
        discountRow.appendChild(discountValue);

        // Insert after tax row
        const taxRow = document.querySelector('.summary-row:nth-child(3)');
        taxRow.insertAdjacentElement('afterend', discountRow);
    } else {
        // Update existing discount row
        discountRow.querySelector('span:first-child').textContent = `Discount (${percentage}%)`;
        discountRow.querySelector('span:last-child').textContent = `-$${discount.toFixed(2)}`;
    }

    // Recalculate total with discount
    const shippingElement = document.querySelector('.summary-row:nth-child(2) span:last-child');
    const shipping = parseFloat(shippingElement.textContent.replace('$', ''));

    const taxElement = document.querySelector('.summary-row:nth-child(3) span:last-child');
    const tax = parseFloat(taxElement.textContent.replace('$', ''));

    const total = subtotal + shipping + tax - discount;
    const totalElement = document.querySelector('.summary-total span:last-child');
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Update cart count badge
function updateCartCount() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartCount = document.querySelector('.cart-count');

    if (cartCount) {
        cartCount.textContent = cartItems.length.toString();
    }

    // Update cart items count in heading
    const cartItemsHeading = document.querySelector('.cart-items h2');
    if (cartItemsHeading) {
        cartItemsHeading.textContent = `Your Items (${cartItems.length})`;
    }
}

// Show empty cart message
function showEmptyCartMessage() {
    const cartItems = document.querySelector('.cart-items');
    const emptyMessage = document.createElement('div');
    emptyMessage.classList.add('empty-cart-message');
    emptyMessage.innerHTML = `
        <div class="empty-cart-icon">
            <i class="fas fa-shopping-cart"></i>
        </div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="products.html" class="btn-primary">Browse Products</a>
    `;

    // Style the empty message
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '3rem 1rem';

    // Clear cart items container and add empty message
    cartItems.innerHTML = '';
    cartItems.appendChild(emptyMessage);

    // Update cart summary
    const subtotalElement = document.querySelector('.summary-row:nth-child(1) span:last-child');
    subtotalElement.textContent = '$0.00';

    const taxElement = document.querySelector('.summary-row:nth-child(3) span:last-child');
    taxElement.textContent = '$0.00';

    const totalElement = document.querySelector('.summary-total span:last-child');
    totalElement.textContent = '$0.00';

    // Disable checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = '0.5';
    checkoutBtn.style.cursor = 'not-allowed';
}

// Update cart after quantity changes
function updateCart() {
    // This would typically sync with a backend or localStorage
    // For demo purposes, we just recalculate totals
    updateCartTotals();
}

// Initialize suggested products
function initSuggestedProducts() {
    const addToCartButtons = document.querySelectorAll('.suggested-products .add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;

            // Animation for adding to cart
            button.textContent = 'ADDED!';
            button.style.backgroundColor = 'var(--secondary-color)';

            // Show notification
            showNotification(`${productName} added to cart!`, 'success');

            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = (parseInt(cartCount.textContent) + 1).toString();
            }

            // Reset button after 2 seconds
            setTimeout(() => {
                button.textContent = 'ADD TO CART';
                button.style.backgroundColor = '';
            }, 2000);
        });
    });
}

// Notification system
function showNotification(message, type = 'success') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');

    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.classList.add('notification-container');
        document.body.appendChild(notificationContainer);

        // Style notification container
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
    }

    // Create notification
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);

    // Create icon based on type
    let icon;
    switch(type) {
        case 'success':
            icon = 'fa-check-circle';
            notification.style.backgroundColor = 'var(--primary-color)';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            notification.style.backgroundColor = 'var(--danger-color)';
            break;
        case 'info':
        default:
            icon = 'fa-info-circle';
            notification.style.backgroundColor = 'var(--accent-color)';
    }

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    // Style notification
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.transform = 'translateX(150%)';
    notification.style.transition = 'transform 0.3s ease';

    // Add notification to container
    notificationContainer.appendChild(notification);

    // Animate notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
