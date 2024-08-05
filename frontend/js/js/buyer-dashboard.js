document.addEventListener('DOMContentLoaded', function () {

    const userId = localStorage.getItem('userId');

    document.getElementById('toggle-options').addEventListener('change', async (event) => {
        event.preventDefault();

        if (event.target.value === 'logout') {
            console.log("selected:", event.target.value);
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
            }
            catch (error) {
                console.error(error.message);
            }
        }

        if (event.target.value === 'purchases') {
            window.location.href = `/user-purchases-page.html?id=${userId}?order=successful`;
        }
    });
    fetchRandomPosts();
});

//this function displays 3 products randomly following the frontend design
async function fetchRandomPosts() {
    try {
        const response = await fetch('/api/v1/users/posts');
        if (!response.ok) {
            console.log("Error fetching posts");
            return;
        }
        const data = await response.json();
        console.log("All posts:", data);

        // Check if data is empty
        if (data.length === 0) {
            console.log("No posts available.");
            return;
        }

        // Generate a set of 3 unique random indices within the range of data length
        const randomIndices = [];
        while (randomIndices.length < 3 && randomIndices.length < data.length) {
            const randomIndex = Math.floor(Math.random() * data.length);
            if (!randomIndices.includes(randomIndex)) {
                randomIndices.push(randomIndex);
            }
        }

        // Retrieve the random posts
        const randomPosts = randomIndices.map(index => data[index]);
        console.log("Random posts:", randomPosts);

        // Display the random posts
        const postContainers = document.querySelectorAll('.shop-cat-box');
        randomPosts.forEach((post, index) => {
            const postId = post._id;
            console.log(postId);
            const postContainer = postContainers[index];
            const postTitle = postContainer.querySelector('#post-title');
            const postImage = postContainer.querySelector('#post-image');

            if (postTitle) {
                postTitle.innerText = post.title;
            } else {
                console.log(`Element with id 'post-title' not found.`);
            }

            if (postImage && Array.isArray(post.images) && post.images.length > 0) {
                postImage.src = post.images[0]; // Displaying the first image in the array
            } else {
                console.log(`Element with id 'post-image' not found or no images available.`);
            }

            // Add click event listener to the post container
            postContainer.addEventListener('click', () => {
                window.location.href = `/product-details.html?id=${post.commodity._id}`;
            });
        });

    } catch (error) {
        console.error('Error fetching or displaying posts:', error);
    }
}

document.addEventListener('click', async (event) => {
    event.preventDefault();
    
    const shop_new_button = document.getElementById('shop_new_button');
    if (event.target === shop_new_button) {
        window.location.href = '/all-products-page.html?products';
    }
});
