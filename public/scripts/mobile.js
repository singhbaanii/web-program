const mobileMenuBtnElement = document.getElementById('mobile-menu-btn'); //we can use DOM cuz its browser side js
const mobileMenuElement = document.getElementById('mobile-menu');

function toggleMobileMenu() {
  mobileMenuElement.classList.toggle('open'); //toggle adds a css class if it doesn't exist yet and removes it if it does, here the class added is 'open'
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);

// javascript code that runs in the brower so its public, interacting with the dom is only possible in the browser cuz you 
// only have to Dom the page, the rendered and parsed HTML elements with which you want to