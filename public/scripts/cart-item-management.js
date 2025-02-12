const cartItemUpdateFormElements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');
const cartFallbackMessage = document.getElementById('cart-total-fallback');
const orderForm = document.getElementById('order-form');

async function updateCartItem(event) {
  event.preventDefault();  //prevents default submission cuz PATCH

  const form = event.target;
  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const inputElement = form.firstElementChild;
  const originalQuantity = inputElement.value;
  
  const quantity = inputElement.value;

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'PATCH',
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong!');
    return;
  }

  if (!response.ok) {
    const errorData = await response.json();
    alert(errorData.message || 'Could not update the cart.');
    inputElement.value = originalQuantity; // Reset the input to the last valid quantity
    return;
  }

  const responseData = await response.json();

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    form.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price');
    cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice.toFixed(2);

    const cartUpdatedQuantityElement = document.querySelector(`.cart-updated-quantity[data-productid="${productId}"]`);
    cartUpdatedQuantityElement.textContent = responseData.updatedCartData.updateItemQuantity;
  }
  
  // Update cart total price
  const newTotalPrice = responseData.updatedCartData.newTotalPrice;
  cartTotalPriceElement.textContent = newTotalPrice.toFixed(2);
  
  for (const cartBadgeElement of cartBadgeElements) { //cuz we use the nav-items file twice once for mobile and once for desktop, thus the badge element is repeated twice
    cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
  }

  updateCartMessage(newTotalPrice); // Show or hide cart message and order button dynamically
}

function updateCartMessage(totalPrice) {
  const isAuthenticated = cartFallbackMessage.dataset.auth === "true";

  if (!isAuthenticated) {
    cartFallbackMessage.textContent = "Log in to proceed and purchase the items.";
    cartFallbackMessage.style.display = "block";
    if (orderForm) orderForm.style.display = "none";
  } else if (totalPrice === 0) {
    cartFallbackMessage.textContent = "Your cart is empty. Add items to your cart before proceeding.";
    cartFallbackMessage.style.display = "block";
    if (orderForm) orderForm.style.display = "none";
  } else {
    cartFallbackMessage.style.display = "none";
    if (orderForm) orderForm.style.display = "block";
  }
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem);
}
