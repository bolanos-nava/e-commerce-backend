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
