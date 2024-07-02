const userId = localStorage.getItem('userId');

async function fetchPurchases(userId) {
    try {
        const response = await fetch(`/api/v1/users/user-purchases/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        if (response.ok) {
            if (data.length === 0) {
                showNoPurchasesMessage(data.message);
            } else {
                renderPurchases(data);
            }
        } else {
            showNoPurchasesMessage(data.message);
        }
    } catch (error) {
        console.error("Error fetching purchases:", error);
        showNoPurchasesMessage("An error occurred while fetching your purchases.");
    }
}

// Function to render purchases
function renderPurchases(purchases) {
    const purchasesContainer = document.getElementById('purchases-container');
    purchasesContainer.innerHTML = ''; // Clear previous content

    purchases.forEach(purchase => {
        purchase.items.forEach(item => {
            const imageUrl = item.images.length > 0 ? `/${item.images[0]}` : 'placeholder.jpg';
            const card = `
                        <div class="col-md-6">
                            <div class="purchase-card">
                                <div class="details">
                                    <img src="${imageUrl}" alt="${item.commodity.title}">
                                    <div>
                                        <h5>${item.commodity.title}</h5>
                                        <p class="price">$${item.price.toFixed(2)}</p>
                                        <p class="quantity">Quantity: ${item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
            purchasesContainer.innerHTML += card;
        });
    });
}

// Function to show no purchases message
function showNoPurchasesMessage(message) {
    document.getElementById('no-purchases').style.display = 'block';
    document.getElementById('no-purchases-message').textContent = message;
}

// Function to go back
function goBack() {
    window.history.back();
}

// Fetch and render purchases on page load
document.addEventListener('DOMContentLoaded', function () {
    if (userId) {
        fetchPurchases(userId);
    } else {
        console.error("User ID not found in localStorage.");
        showNoPurchasesMessage("User ID not found. Please log in again.");
    }
});