document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.book-card button');
  
    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('.book-card');
        const title = card.querySelector('h3').innerText.trim();
        const author = card.querySelector('.author').innerText.trim();
        const priceText = card.querySelector('.price').innerText.trim().replace(/[^\d]/g, ''); // Extract digits only
        const image = card.querySelector('img').src;
  
        const price = parseInt(priceText); // Convert to number safely
  
        const item = { title, author, price, image };
  
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
  
        alert(`${title} added to cart!`);
      });
    });
  });
  