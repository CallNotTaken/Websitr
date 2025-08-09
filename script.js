
let cart = JSON.parse(localStorage.getItem('cart')) || [];


function showProductDetail(name, image, price, category, description, sizes=[]) {
  
  document.getElementById("product-name").textContent = name;
  document.getElementById("product-image").src = image;
  document.getElementById("product-price").textContent = price;

  const sizeSelect = document.getElementById("size-select");
  const sizeLabel = document.querySelector("label[for='size-select']");

  document.querySelectorAll('[id$="-details"]').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.size-guide').forEach(el => el.style.display = 'none');

  const productId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const productDetails = document.getElementById(`${productId}-details`);

  if (productDetails) {
    productDetails.style.display = 'block';
    const descElement = productDetails.querySelector('.product-description p');
    if (descElement) {
      descElement.textContent = description;
    }
  }

  sizeSelect.innerHTML = "";

   if (sizes.length > 0) {
    sizeLabel.style.display = "block";
    sizeSelect.style.display = "block";

    sizes.forEach(size => {
      const option = document.createElement("option");
      option.value = size.toLowerCase();
      option.textContent = size;
      sizeSelect.appendChild(option);
    });
  } else {
    sizeLabel.style.display = "none";
    sizeSelect.style.display = "none";
   }

  /*if (category === 'bikes' || category === 'apparels') {
    sizeSelect.style.display = "block";
    sizeLabel.style.display = "block"; */

    const currentProductDetails = document.getElementById(`${productId}-details`);
    if (currentProductDetails) {
      const sizeGuide = currentProductDetails.querySelector(`.${category === 'bikes' ? 'bike-size-guide' : 'size-guide'}`);
      if (sizeGuide) {
        sizeGuide.style.display = "block";
      }
    }

  document.getElementById("back-to-products").href = `#${category}`;
}

function addToCart(name, price, buyNow = false, image) {
  const numericPrice = parseFloat(price.replace('₱', '').replace(',', ''));

  if (buyNow) {
    cart = [{
      name: name,
      price: numericPrice,
      quantity: 1,
      image: image
    }];
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
    return;
  }

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: numericPrice,
      quantity: 1,
      image: image
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Item added to cart!');
}

function updateCart() {
  const cartDisplay = document.getElementById('cart-items');
  if (!cartDisplay) return;

  cartDisplay.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>Price: ₱${item.price.toLocaleString()}</p>
        <p>
          Quantity: 
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
        </p>
        <p>Subtotal: ₱${itemTotal.toLocaleString()}</p>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
      `;

    cartDisplay.appendChild(itemDiv);
  });

  const totalElement = document.getElementById('cart-total');
  if (totalElement) {
    totalElement.textContent = `₱${total.toLocaleString()}`;
  }

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.style.display = cart.length > 0 ? 'inline-block' : 'none';
  }
}

function updateQuantity(index, change) {
  cart[index].quantity = Math.max(1, cart[index].quantity + change);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function clearCart() {
  cart = [];
  localStorage.removeItem('cart');
  updateCart();
}

if (window.location.pathname.includes('cart.html')) {
  updateCart();
}

