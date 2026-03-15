document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.querySelector(".checkout-btn");
  
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Filter out bad data
    cart = cart.filter(item => item && item.title && item.price && item.image && item.author);
  
    // Ensure every item has quantity
    cart = cart.map(item => {
      if (!item.quantity || typeof item.quantity !== "number") {
        item.quantity = 1;
      }
      return item;
    });
  
    function updateCartTotal() {
      let total = 0;
      cart.forEach(item => {
        total += item.price * item.quantity;
      });
      cartTotal.textContent = total.toFixed(2); // ₹ is in HTML
    }
  
    function updateCartDisplay() {
      cartItemsContainer.innerHTML = "";
  
      cart.forEach((item, index) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("cart-book");
  
        bookCard.innerHTML = `
          <img src="${item.image}" alt="${item.title}">
          <div>
            <h3>${item.title}</h3>
            <p>by ${item.author}</p>
            <p>Price: ₹${item.price}</p>
            <div class="quantity-control">
              <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
              <span class="qty">${item.quantity}</span>
              <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
          </div>
        `;
  
        cartItemsContainer.appendChild(bookCard);
      });
  
      updateCartTotal();
      attachEventHandlers();
    }
  
    function attachEventHandlers() {
      document.querySelectorAll(".qty-btn").forEach(button => {
        button.addEventListener("click", () => {
          const index = parseInt(button.dataset.index);
          const action = button.dataset.action;
  
          if (action === "increase") {
            cart[index].quantity += 1;
          } else if (action === "decrease" && cart[index].quantity > 1) {
            cart[index].quantity -= 1;
          }
  
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartDisplay();
        });
      });
  
      document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", () => {
          const index = parseInt(button.dataset.index);
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartDisplay();
        });
      });
    }
  
    // === Modal Setup ===
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      showCheckoutModal();
    });
  
    function showCheckoutModal() {
      const modal = document.createElement("div");
      modal.classList.add("modal");
      modal.innerHTML = `
        <div class="modal-content">
          <h2>Checkout</h2>
          <form id="checkout-form">
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="text" placeholder="Shipping Address" required />
            <select required>
              <option value="" disabled selected>Payment Method</option>
              <option value="cod">Cash on Delivery</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
            </select>
            <div class="modal-actions">
              <button type="submit" class="submit-btn">Confirm Order</button>
              <button type="button" class="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
      modal.style.display = "flex";
  
      // Cancel button handler
      modal.querySelector(".cancel-btn").addEventListener("click", () => {
        modal.remove();
      });
  
      // Form submit handler
      modal.querySelector("#checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thank you for your purchase!");
        localStorage.removeItem("cart");
        cart = [];
        updateCartDisplay();
        modal.remove();
      });
    }
  
    // Initialize cart display
    updateCartDisplay();
  });
  