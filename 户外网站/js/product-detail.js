// Product Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Thumbnail Image Selection
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));

            // Add active class to clicked thumbnail
            this.classList.add('active');

            // Update main image source
            const imgSrc = this.getAttribute('data-image');
            if (mainImage && imgSrc) {
                mainImage.src = imgSrc;
            }
        });
    });

    // Quantity Selector
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');

    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });

        // Ensure valid input
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    }

    // Color Options
    const colorOptions = document.querySelectorAll('.color-option');

    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Size Options
    const sizeOptions = document.querySelectorAll('.size-option');

    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add to Cart
    const addToCartBtn = document.getElementById('add-to-cart');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Get product info
            const productName = document.querySelector('.product-info h1').textContent;
            const productPrice = document.querySelector('.current-price').textContent;
            const productQuantity = document.getElementById('quantity').value;
            const productColor = document.querySelector('.color-option.active')?.getAttribute('data-color') || '';
            const productSize = document.querySelector('.size-option.active')?.getAttribute('data-size') || '';

            // Show notification
            showNotification(`Added to cart: ${productQuantity} × ${productName} (${productColor}, ${productSize})`);

            // Change button text temporarily
            const originalText = addToCartBtn.textContent;
            addToCartBtn.textContent = 'ADDED TO CART';
            addToCartBtn.style.backgroundColor = 'var(--secondary-color)';

            setTimeout(() => {
                addToCartBtn.textContent = originalText;
                addToCartBtn.style.backgroundColor = '';
            }, 2000);
        });
    }

    // Wishlist button toggle
    const wishlistBtn = document.querySelector('.wishlist-btn');

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');

            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.backgroundColor = '#ffeeee';
                this.style.color = '#e63946';
                this.style.borderColor = '#ffcccc';
                showNotification('Added to wishlist');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.borderColor = '';
                showNotification('Removed from wishlist');
            }
        });
    }

    // Product Detail Tabs
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get the tab's data-tab attribute
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs and tab panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked tab and corresponding tab pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Category Navigation for Mobile
    const categoryItems = document.querySelectorAll('.category-item');

    categoryItems.forEach(item => {
        const itemLink = item.querySelector('a');

        // For mobile, add functionality to toggle subcategory/mega menu display
        if (window.innerWidth <= 768) {
            itemLink.addEventListener('click', function(e) {
                const parent = this.parentElement;

                // Check if this item has a subcategory dropdown or mega menu
                const hasDropdown = parent.querySelector('.subcategory-dropdown') !== null;
                const hasMegaMenu = parent.querySelector('.mega-menu') !== null;

                if (hasDropdown || hasMegaMenu) {
                    e.preventDefault();

                    // Toggle the open class
                    if (parent.classList.contains('open')) {
                        parent.classList.remove('open');
                    } else {
                        // Close all other open categories first
                        document.querySelectorAll('.category-item.open').forEach(openItem => {
                            if (openItem !== parent) {
                                openItem.classList.remove('open');
                            }
                        });

                        parent.classList.add('open');
                    }
                }
            });
        }
    });

    // Notification system
    function showNotification(message) {
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
        notification.classList.add('notification');
        notification.textContent = message;

        // Style notification
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '4px';
        notification.style.marginBottom = '10px';
        notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)';
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

    // Review images preview
    const reviewImages = document.querySelectorAll('.review-images img');

    reviewImages.forEach(img => {
        img.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.classList.add('image-preview-modal');

            const modalImg = document.createElement('img');
            modalImg.src = this.src;

            const closeBtn = document.createElement('span');
            closeBtn.classList.add('close-preview');
            closeBtn.innerHTML = '&times;';

            modal.appendChild(closeBtn);
            modal.appendChild(modalImg);
            document.body.appendChild(modal);

            // Style modal
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '2000';

            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '20px';
            closeBtn.style.right = '30px';
            closeBtn.style.color = 'white';
            closeBtn.style.fontSize = '40px';
            closeBtn.style.fontWeight = 'bold';
            closeBtn.style.cursor = 'pointer';

            modalImg.style.maxWidth = '90%';
            modalImg.style.maxHeight = '90%';
            modalImg.style.objectFit = 'contain';

            closeBtn.addEventListener('click', function() {
                modal.remove();
            });

            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });
});
