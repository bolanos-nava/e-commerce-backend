/* eslint-disable no-param-reassign */

const { hostname, isLogged, isAdmin } = window;
console.log(`This came from this pod: ${hostname}`);
const params = new URLSearchParams(window.location.search);

function toggleAdminButtons() {
  const btnAdmin = document.getElementById('btnAdmin');
  const btnCart = document.getElementById('btnCart');
  if (isAdmin) {
    btnAdmin.classList.remove('d-none'); // show button admin
    btnCart.classList.add('d-none'); // hide button cart
  } else {
    btnAdmin.classList.add('d-none'); // hide button admin
  }
}

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
  if (!isLogged) {
    localStorage.removeItem('user');
    localStorage.removeItem('isLogged');
  }

  if (
    params.get('logged') === 'true' ||
    (localStorage.getItem('isLogged') && !localStorage.getItem('user'))
  ) {
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
  toggleAdminButtons();
}

main();
