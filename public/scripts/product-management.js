const deleteProductButtonElements = document.querySelectorAll('.product-item button');
const clearButton = document.querySelector('[name="clean-btn"]');


async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid; //accesses the data- attribute values where we have stored the productid
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, { //fetch funtion is ajax used for post or delete request as well
    method: 'DELETE' //using http method delete, it doesnt have a body so we add csrf token and '?'
    //to use DELETE and PATCH requests we need to use js cuz forms only use POST and GET
  });

  if (!response.ok) { //if not a 2## code
    alert('Something went wrong!');
    return;
  }

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove(); //remove built in method for dom elements and it will remove the element from the dom when called
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}


function clearFormFields() {
  const productFormDataElements = document.querySelectorAll('.product-form-data');

  productFormDataElements.forEach(function(element) {
    if (element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'input') {
      element.value = ''; 
    }
  });
}


if (clearButton) { // Add event listener for the clear button because all products page does not have a clearbutton so dom will have network error
  clearButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent submit action ie default
    clearFormFields(); 
  })};
