/* eslint-disable no-param-reassign */

const { pagination } = window;
const params = new URLSearchParams(window.location.search);

function attatchListenerToCartButton() {
  const btnCart = document.getElementById('btnCart');
  btnCart.addEventListener('click', async () => {
    let cartId = localStorage.getItem('cartId');
    console.log('cartId', cartId);
    if (!cartId) {
      let cartCreationResponse = await fetch('/api/v1/carts', {
        method: 'POST',
      });
      cartCreationResponse = await cartCreationResponse.json();
      console.log('cartCreationResponse', cartCreationResponse);
      cartId = cartCreationResponse.payload.cart._id;
      localStorage.setItem('cartId', cartId);
    }

    window.location.href = `/cart/${cartId}`;
  });
}

function attatchListenerToLogoutButton() {
  document.getElementById('btnLogout').addEventListener('click', async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('logged');
    // window.location.pathname = '/login';

    const response = await fetch('/api/v1/sessions/jwt', { method: 'DELETE' });
    if (response.ok) window.location.pathname = '/login';

    // const response = await fetch('/api/v1/sessions', { method: 'DELETE' });
    // if (response.ok) window.location.pathname = '/login';
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
  if (localStorage.getItem('logged')) {
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
  const resp = await fetch('/api/v1/sessions/current', { method: 'POST' });
  try {
    console.log('jwt', await resp.json());
  } catch (error) {
    console.log('no jwt');
  }

  console.log('logged', params.get('logged'));
  if (params.get('logged') === 'true') {
    const url = new URL(window.location.href);
    localStorage.setItem('logged', true);
    url.searchParams.delete('logged');
    window.history.replaceState(window.history.state, '', url.href);
    console.log("We're here");
  }
  attatchListenerToCartButton();
  attatchListenerToLogoutButton();
  hideLoginButtons();
  const productsItems = document.querySelectorAll('.products__list .item');

  const btnPrevPage = document.querySelector('#btnPrevPage');
  const btnNextPage = document.querySelector('#btnNextPage');

  if (pagination.hasPrevPage) {
    btnPrevPage.addEventListener('click', () => {
      changeQueryParams('page', pagination.prevPage);
    });
  }
  if (pagination.hasNextPage) {
    btnNextPage.addEventListener('click', () => {
      changeQueryParams('page', pagination.nextPage);
    });
  }

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
      let cartId = localStorage.getItem('cartId');
      if (!cartId) {
        let cartCreationResponse = await fetch('/api/v1/carts', {
          method: 'POST',
        });
        cartCreationResponse = await cartCreationResponse.json();
        cartId = cartCreationResponse.payload.cart._id;
        localStorage.setItem('cartId', cartId);
      }

      const response = await fetch(
        `/api/v1/carts/${cartId}/products/${productItem.dataset.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: quantityDisplay.textContent }),
        },
      );
      const jsonResponse = await response.json();
    });
  });
}

main();
