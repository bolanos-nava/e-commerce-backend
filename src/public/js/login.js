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

  const response = await fetch('/api/v1/sessions/jwt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData),
  });
  try {
    const jsonResponse = await response.json();
    if (jsonResponse?.payload?.jwt) {
      localStorage.setItem('token', jsonResponse.payload.jwt); // gets jwt in the response and stores it in local storage
    }
    if (jsonResponse.status === 'error') {
      params.set('error', 'bad_credentials');
      window.location.search = params.toString();
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (response.ok) {
      localStorage.setItem('logged', true); // if getting jwt through cookies, saves a "logged" variable in local storage
      window.location = '/';
    }
  }
});
