const cartItemUpdateFormElements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

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
  
  cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);
  
  for (const cartBadgeElement of cartBadgeElements) { //cuz we use the nav-items file twice once for mobile and once for desktop, thus the badge element is repeated twice
    cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
  }
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem);
}
