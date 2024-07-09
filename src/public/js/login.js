const params = new URLSearchParams(window.location.search);
const errorParam = params.get('error')?.toLowerCase();
if (errorParam && errorParam !== '') {
  const errorAlert = document.querySelector('#errorAlert');
  const errorAlertText = errorAlert.querySelector('#errorAlertSpan');

  const errorsMapping = {
    bad_credentials: 'Correo o contraseña incorrectas',
    third_party_auth_error:
      'Error en la autenticación externa. Inténtelo de nuevo',
  };
  if (Object.keys(errorsMapping).includes(errorParam)) {
    errorAlert.classList.remove('d-none');
    errorAlertText.innerText = errorsMapping[errorParam];
  }
}

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const loginData = Object.fromEntries(new FormData(loginForm));

  let path = '/api/v1/sessions';
  const cartId = JSON.parse(localStorage.getItem('user'))?.cart;
  if (cartId) path += `?cart=${cartId}`;
  const response = await fetch(path, {
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
      params.set('error', 'bad_credentials');
      window.location.search = params.toString();
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (response.ok) window.location = '/?logged=true';
  }
});
