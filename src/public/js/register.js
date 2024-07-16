import { REGISTER_DICTIONARIES } from './utils/errors.js';

const { SERVER_ERRORS_DICTIONARY, PARAMS_MESSAGES_DICTIONARY } =
  REGISTER_DICTIONARIES;

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

const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const newUser = Object.fromEntries(new FormData(registerForm));

  try {
    const response = await fetch('/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser }),
    });
    const jsonResponse = await response.json();
    if (response.ok) {
      // redirect if registration is successful
      registerForm.reset();
      window.location = '/login';
      return;
    }
    if (jsonResponse.status === 'error') {
      // show error message if server responded with error
      params.set(
        'error',
        SERVER_ERRORS_DICTIONARY[jsonResponse.code] || 'error',
      );
      window.location.search = params.toString();
    }
  } catch (error) {
    console.error(error);
  }
});
