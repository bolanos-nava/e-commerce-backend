/* eslint-disable no-param-reassign */
const btnRealTimeProducts = document.getElementById('btnRealTimeProducts');
const btnAdmin = document.getElementById('btnAdmin');
const btnCart = document.getElementById('btnCart');
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const btnLogout = document.getElementById('btnLogout');

const { hostname, isLogged, isAdmin } = window;
console.log(`This came from this pod: ${hostname}`);

function toggleAdminButtons() {
  if (isAdmin) {
    console.log('Admin');
    btnAdmin.classList.remove('d-none'); // show button admin
    btnCart.classList.add('d-none'); // hide button cart
    btnLogin.classList.add('d-none'); // hide login
    btnRegister.classList.add('d-none'); // hide register
  } else {
    console.log('Not admin');
    btnAdmin.classList.add('d-none'); // hide button admin
  }
}

function toggleRealTimeProductsButton() {
  const user = localStorage.getItem('user');
  if (!user) return;
  const { role } = JSON.parse(user);
  if (['admin', 'user_premium'].includes(role)) {
    btnRealTimeProducts.classList.remove('d-none'); // show button to go to real time products view
  } else {
    btnRealTimeProducts.classList.add('d-none'); // hide button
  }
}

function attatchListenerToCartButton() {
  document.getElementById('btnCart').addEventListener('click', async () => {
    let cartId =
      localStorage.getItem('cartId') ||
      JSON.parse(localStorage.getItem('user'))?.cart;
    if (cartId) {
      window.location.href = `/cart/${cartId}`;
      return;
    }

    try {
      const sessionData = await fetch('/api/v1/sessions/current');
      console.log(sessionData);
      if (sessionData.ok) {
        const sessionUser = (await sessionData.json()).payload.user;
        localStorage.setItem('user', JSON.stringify(sessionUser));
        localStorage.setItem('isLogged', true);
        cartId = sessionUser.cart;
        window.location.href = `/cart/${cartId}`;
        return;
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await (
        await fetch('/api/v1/carts', {
          method: 'POST',
        })
      ).json();
      cartId = response.payload.cart._id;
      localStorage.setItem('cartId', cartId);
      window.location.href = `/cart/${cartId}`;
    } catch (error) {
      console.error(error);
    }
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

  if (localStorage.getItem('isLogged') && !localStorage.getItem('user')) {
    try {
      const sessionData = await (
        await fetch('/api/v1/sessions/current')
      ).json();
      const sessionUser = sessionData.payload.user;
      localStorage.setItem('user', JSON.stringify(sessionUser));
      localStorage.setItem('isLogged', true);
      localStorage.removeItem('cartId');
      const url = new URL(window.location.href);
      url.searchParams.delete('logged');
      window.history.replaceState(window.history.state, '', url.href);
    } catch (error) {
      console.error(error);
    }
  }

  attatchListenerToCartButton();
  attatchListenerToLogoutButton();
  toggleAdminButtons();
  toggleRealTimeProductsButton();
  hideLoginButtons();
}

main();
