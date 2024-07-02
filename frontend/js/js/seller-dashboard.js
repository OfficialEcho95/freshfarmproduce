document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('user-options').addEventListener('change', async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        console.log('Selected option:', event.target.value); // Log selected option

        if (event.target.value === 'logout') {
            try {
                const response = await fetch('/api/v1/users/logout-user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Clear cache
                    if ('caches' in window) {
                        const cacheNames = await caches.keys();
                        await Promise.all(
                            cacheNames.map(cacheName => caches.delete(cacheName))
                        );
                    }

                    // Redirect to home page
                    window.location.href = '/';
                } else {
                    throw new Error('Error logging out');
                }
            } catch (error) {
                console.error('Logout error:', error.message);
            }
        }

        // Handle the add product function
        if (event.target.value === 'add-products') {
            // Redirect to add-product-page.html (use absolute path)
            window.location.href = '/add-product-page.html';
        }

        // Handle the show products function
        const userId = localStorage.getItem('userId');
        const comId = localStorage.getItem('comId'); //commodity Id

        if (event.target.value === 'show-products') {
            window.location.href = `/show-product-page.html?=${userId}`;
        }

        if (event.target.value === 'update-product') {
            window.location.href = `/update-product-page.html?id=${userId}?comId=${comId}`;
        }

        if (event.target.value === 'purchases') {
            window.location.href = `/user-purchases-page.html?id=${userId}?order=successful`;
        }
    });


    async function fetchPosts() {
        const response = await fetch('/api/v1/users/posts');
        if (!response.ok) {
            console.log("Error fetching posts");
        }
        const data = response.json();
        console.log(data);
    }
});

