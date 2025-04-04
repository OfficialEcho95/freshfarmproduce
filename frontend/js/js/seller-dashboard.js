document.addEventListener('DOMContentLoaded', async (event) => {
  event.preventDefault();

  document.getElementById('user-options').addEventListener('change', async (event) => {
    event.preventDefault();
    console.log('Selected option:', event.target.value);

    if (event.target.value === 'logout') {
      try {
        const response = await fetch('/api/v1/users/logout-user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Clear cache
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
              cacheNames.map((cacheName) => caches.delete(cacheName)),
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
      window.location.href = '/add-product-page.html';
    }

    // Handle the show products function
    const userId = localStorage.getItem('userId');
    const comId = localStorage.getItem('comId'); // commodity Id

    if (event.target.value === 'show-products') {
      window.location.href = `/show-product-page.html?=${userId}`;
    }

    if (event.target.value === 'sales-history') {
      window.location.href = `/show-sales-report-page.html?=${userId}`;
    }

    if (event.target.value === 'update-product') {
      window.location.href = `/update-product-page.html?id=${userId}?comId=${comId}`;
    }

    if (event.target.value === 'purchases') {
      window.location.href = `/user-purchases-page.html?id=${userId}?order=successful`;
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const shopNewButtons = document.querySelectorAll('.shopnewbutton');

  shopNewButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = '/all-products-page.html?products';
    });
  });

  const topfeaturedButton = document.querySelector('.top-featured-button');
  topfeaturedButton.addEventListener('click', async () => {});
});

// displaying 3 random posts below the shop new section
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('api/v1/users/posts');
    const data = await response.json();

    if (response.ok) {
      // Get all elements with class belowshopnew
      const productContainers = document.querySelectorAll('.belowshopnew');

      // Ensure that the number of products matches the number of containers
      data.slice(0, productContainers.length).forEach((product, index) => {
        const container = productContainers[index];
        const img = container.querySelector('.belowshopnewimage');
        const title = container.querySelector('.belowshopnewtitle');

        // Set the image source
        if (product.commodity.images && product.commodity.images.length > 0) {
          img.src = product.commodity.images[0];
          img.alt = 'Product Image';
        }

        // Set the product title
        title.textContent = product.title;
        title.href = `/product-details.html?id=${product.commodity._id}`;
      });
    } else {
      console.error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('api/v1/users/posts');
    const data = await response.json();

    if (response.ok) {
      // Get the template product element
      const templateProduct = document.querySelector('.product-template');
      const parentContainer = document.querySelector('.special-list');
      const allButton = document.querySelector('.all-products-button');

      allButton.addEventListener('click', () => {
        window.location.href = '/all-products-page.html?products';
      });

      // Clear existing dynamically generated products
      const existingProducts = document.querySelectorAll('.dynamic-product');
      existingProducts.forEach((product) => product.remove());

      // Select 4 random items from the data
      const randomProducts = [];
      const usedIndices = new Set();
      while (randomProducts.length < 4 && randomProducts.length < data.length) {
        const randomIndex = Math.floor(Math.random() * data.length);
        if (!usedIndices.has(randomIndex)) {
          randomProducts.push(data[randomIndex]);
          usedIndices.add(randomIndex);
        }
      }

      // Populate the template and clone it for each product
      randomProducts.forEach((product) => {
        const newProduct = templateProduct.cloneNode(true);
        newProduct.classList.remove('product-template');
        newProduct.classList.add('dynamic-product');

        const img = newProduct.querySelector('.dynamic-image');
        const title = newProduct.querySelector('.dynamic-title');
        const price = newProduct.querySelector('.dynamic-price');

        // Set the image source
        if (product.commodity.images && product.commodity.images.length > 0) {
          img.src = product.commodity.images[0];
          img.alt = 'Product Image';
        }

        // Set the product price
        if (product.commodity.price) {
          price.textContent = `$${product.commodity.price.toFixed(2)}`;
        }

        // Set the product title
        if (product.title) {
          title.textContent = product.title;
          title.href = `/product-details.html?id=${product.commodity._id}`;
        }

        // Append the new product to the parent container
        parentContainer.appendChild(newProduct);
      });

      // Hide the template product element after cloning
      templateProduct.style.display = 'none';
    } else {
      console.error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
