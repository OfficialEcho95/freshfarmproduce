document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('api/v1/users/cart');
        const cartData = await response.json();

        if (response.ok) {
            console.log('Cart Data:', cartData); // Log entire cartData to inspect its structure

            const items = cartData.cart.items;

            // Ensure the cart-list element is selected correctly
            const cartItemsContainer = document.querySelector('.cart-list');
            if (!cartItemsContainer) {
                console.error('Cart items container not found.');
                return;
            }

            if (items && Array.isArray(items)) {
                items.forEach(item => {
                    console.log('Cart Item:', item); // Log each item to verify its contents

                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td><img src="${item.commodity.images[0]}" alt="${item.commodity.title}" class="cart-thumb" style="width: 100px; height: auto;" /></td>
                        <td>${item.commodity.title || 'N/A'}</td>
                        <td>${formatPrice(item.commodity.price)}</td>
                        <td>${item.quantity}</td>
                        <td>${formatPrice(item.price * item.quantity)}</td>
                        <td><button class="remove-item" data-id="${item._id}">Remove</button></td>
                    `;

                    cartItemsContainer.appendChild(row);
                });

                // Update order summary
                const subTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
                const discount = 40; // Assuming a fixed discount for now
                const couponDiscount = 10; // Assuming a fixed coupon discount for now
                const tax = 2; // Assuming a fixed tax for now
                const shippingCost = 0; // Free shipping for now
                const grandTotal = subTotal - discount - couponDiscount + tax + shippingCost;

                document.getElementById('sub-total').textContent = formatPrice(subTotal);
                document.getElementById('discount').textContent = formatPrice(discount);
                document.getElementById('coupon-discount').textContent = formatPrice(couponDiscount);
                document.getElementById('tax').textContent = formatPrice(tax);
                document.getElementById('shipping-cost').textContent = shippingCost === 0 ? 'Free' : formatPrice(shippingCost);
                document.getElementById('grand-total').textContent = formatPrice(grandTotal);
            } else {
                console.error('No items found or items is not an array');
            }
        } else {
            console.error('Failed to fetch cart data');
        }
    } catch (err) {
        console.error('Error:', err);
    }
});

// Function to format price as currency
const formatPrice = (price) => `$${(price).toFixed(2)}`;
