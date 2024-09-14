/* eslint-disable no-param-reassign */

const { pagination } = window;
const params = new URLSearchParams(window.location.search);

function changeQueryParams(key, value) {
  params.set(key, value);
  window.location.search = params.toString();
}

async function main() {
  if (pagination.hasPrevPage) {
    const btnPrevPage = document.querySelector('#btnPrevPage');
    btnPrevPage.addEventListener('click', () => {
      changeQueryParams('page', pagination.prevPage);
    });
  }
  if (pagination.hasNextPage) {
    const btnNextPage = document.querySelector('#btnNextPage');
    btnNextPage.addEventListener('click', () => {
      changeQueryParams('page', pagination.nextPage);
    });
  }

  const productsItems = document.querySelectorAll('.products__list .item');
  productsItems.forEach((productItem) => {
    const btnMinus = productItem.querySelector('.btn-minus-qty');
    const btnPlus = productItem.querySelector('.btn-plus-qty');
    const quantityDisplay = productItem.querySelector('.quantity-display');
    const btnAddToCart = productItem.querySelector('.btn-add-to-cart');
    const stockText = productItem.querySelector('.product__stock');

    const stock = Number(stockText.textContent);

    const changeDisplayedQuantity = (quantity, quantityDisplayElement) => {
      if (quantity > 0 && quantity <= stock) {
        quantityDisplayElement.textContent = quantity;
      }
    };

    btnMinus.addEventListener('click', () => {
      let quantity = Number(quantityDisplay.textContent);
      changeDisplayedQuantity(quantity - 1, quantityDisplay);

      quantity = Number(quantityDisplay.textContent);
      if (quantity <= 0) btnMinus.setAttribute('disabled', true);
      else btnMinus.removeAttribute('disabled');
      if (quantity < stock) btnPlus.removeAttribute('disabled');
    });
    btnPlus.addEventListener('click', () => {
      let quantity = Number(quantityDisplay.textContent);
      changeDisplayedQuantity(quantity + 1, quantityDisplay);

      quantity = Number(quantityDisplay.textContent);
      if (quantity >= stock) btnPlus.setAttribute('disabled', true);
      else btnPlus.removeAttribute('disabled');
      if (quantity > 0) btnMinus.removeAttribute('disabled');
    });

    btnAddToCart.addEventListener('click', async () => {
      const createTicketFetch = (cartId) =>
        fetch(`/api/v1/carts/${cartId}/products/${productItem.dataset.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: quantityDisplay.textContent }),
        });

      let cartId =
        localStorage.getItem('cartId') ||
        JSON.parse(localStorage.getItem('user'))?.cart;
      if (cartId) return createTicketFetch(cartId);

      try {
        const sessionData = await fetch('/api/v1/sessions/current');
        if (sessionData.ok) {
          const sessionUser = (await sessionData.json()).payload.user;
          localStorage.setItem('user', JSON.stringify(sessionUser));
          localStorage.setItem('isLogged', true);
          cartId = sessionUser.cart;
        }
      } catch (error) {
        console.error(error);
      }
      if (cartId) return createTicketFetch(cartId);

      try {
        const response = await (
          await fetch('/api/v1/carts', {
            method: 'POST',
          })
        ).json();
        cartId = response.payload.cart._id;
        localStorage.setItem('cartId', cartId);
      } catch (error) {
        console.error(error);
      }
      if (cartId) return createTicketFetch(cartId);
    });
  });
}

main();
