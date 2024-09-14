/* eslint-disable no-unused-expressions */
import { LOGIN_DICTIONARIES } from './utils/errors.js';

const { SERVER_ERRORS_DICTIONARY, PARAMS_MESSAGES_DICTIONARY } =
  LOGIN_DICTIONARIES;

const params = new URLSearchParams(window.location.search);
let errorParam = params.has('error')
  ? params.get('error')?.toLowerCase() || 'error'
  : undefined;
if (errorParam && errorParam !== '') {
  const errorAlert = document.querySelector('#errorAlert');
  errorAlert.classList.remove('d-none');
  const errorAlertText = errorAlert.querySelector('#errorAlertSpan');
  errorParam = errorParam in PARAMS_MESSAGES_DICTIONARY ? errorParam : 'error';
  errorAlertText.innerText = PARAMS_MESSAGES_DICTIONARY[errorParam];
}

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const loginData = Object.fromEntries(new FormData(loginForm));

  const cart = localStorage.getItem('cartId');
  const path = new URL('/api/v1/sessions', document.location);
  cart && path.searchParams.append('cart', cart);
  const response = await fetch(path.href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData),
  });
  try {
    const jsonResponse = await response.json();
    if (jsonResponse?.payload?.jwt) {
      localStorage.setItem('user', jsonResponse.payload.jwt); // gets jwt in the response and stores it in local storage
    }
    if (jsonResponse.status === 'error') {
      params.set(
        'error',
        SERVER_ERRORS_DICTIONARY[jsonResponse.code] || 'error',
      );
      window.location.search = params.toString();
    }

    localStorage.setItem('user', JSON.stringify(jsonResponse.payload.user));
    localStorage.setItem('isLogged', true);
    localStorage.removeItem('cartId');
  } catch (error) {
    console.error(error);
  } finally {
    if (response.ok) window.location = '/?logged=true';
  }
});
