/* eslint-disable no-param-reassign */

const { pagination } = window;
const params = new URLSearchParams(window.location.search);

function attatchListenerToCartButton() {
  document.getElementById('btnCart').addEventListener('click', async () => {
    let cartId = JSON.parse(localStorage.getItem('user'))?.cart;

    if (!cartId) {
      try {
        const response = await (
          await fetch('/api/v1/carts', {
            method: 'POST',
          })
        ).json();
        cartId = response.payload.cart._id;
        localStorage.setItem('user', JSON.stringify({ cart: cartId }));
      } catch (error) {
        console.error(error);
      }
    }

    if (cartId) window.location.href = `/cart/${cartId}`;
  });
}

function attatchListenerToLogoutButton() {
  document.getElementById('btnLogout').addEventListener('click', async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLogged');

    const response = await fetch('/api/v1/sessions', { method: 'DELETE' });
    if (response.ok) window.location.pathname = '/login';
  });
}

function changeQueryParams(key, value) {
  params.set(key, value);
  window.location.search = params.toString();
}

function hideLoginButtons() {
  const btnLogin = document.getElementById('btnLogin');
  const btnRegister = document.getElementById('btnRegister');
  const btnLogout = document.getElementById('btnLogout');
  if (localStorage.getItem('isLogged')) {
    btnLogin.classList.add('d-none'); // hide login
    btnRegister.classList.add('d-none'); // hide register
    btnLogout.classList.remove('d-none'); // show logout
  } else {
    btnLogin.classList.remove('d-none'); // show login
    btnRegister.classList.remove('d-none'); // show register
    btnLogout.classList.add('d-none'); // hide logout
  }
}

async function main() {
  if (params.get('logged') === 'true') {
    try {
      const sessionData = await (
        await fetch('/api/v1/sessions/current')
      ).json();
      const sessionUser = sessionData.payload.user;
      localStorage.setItem('user', JSON.stringify(sessionUser));
      localStorage.setItem('isLogged', true);
      const url = new URL(window.location.href);
      url.searchParams.delete('logged');
      window.history.replaceState(window.history.state, '', url.href);
    } catch (error) {
      console.error(error);
    }
  }

  attatchListenerToCartButton();
  attatchListenerToLogoutButton();
  hideLoginButtons();

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
      let cartId = JSON.parse(localStorage.getItem('user'))?.cart;
      if (!cartId) {
        try {
          cartId = (
            await (
              await fetch('/api/v1/carts', {
                method: 'POST',
              })
            ).json()
          ).payload.cart._id;
          localStorage.setItem('user', JSON.stringify({ cart: cartId }));
        } catch (error) {
          console.log(error);
        }
      }

      if (cartId) {
        fetch(`/api/v1/carts/${cartId}/products/${productItem.dataset.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: quantityDisplay.textContent }),
        });
      }
    });
  });
}

main();
