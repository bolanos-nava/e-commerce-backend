const ERRORS_MAPPING = {
  DuplicateResourceError: {
    urlParam: 'user_exists',
    message: 'Usuario ya registrado',
  },
  InternalServerError: {
    urlParam: 'error',
    message: 'Error inesperado',
  },
  ZodError: {
    urlParam: 'bad_form',
    message: 'Información inválida',
  },
};

const params = new URLSearchParams(window.location.search);
let errorParam = params.get('error')?.toLowerCase();
if (errorParam && errorParam !== '') {
  const errorAlert = document.querySelector('#errorAlert');
  errorAlert.classList.remove('d-none');

  const errorAlertText = errorAlert.querySelector('#errorAlertSpan');
  const paramsErrorsMapping = Object.values(ERRORS_MAPPING).reduce(
    (mapping, { urlParam, message }) => {
      // eslint-disable-next-line no-param-reassign
      mapping[urlParam] = message;
      return mapping;
    },
    {},
  );
  if (!Object.keys(paramsErrorsMapping).includes(errorParam)) {
    errorParam = 'default';
  }
  errorAlertText.innerText = paramsErrorsMapping[errorParam];
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
      window.location = '/login';
      return;
    }
    if (jsonResponse.status === 'error') {
      // show error message if server responded with error
      params.set('error', ERRORS_MAPPING[jsonResponse.code].urlParam);
      window.location.search = params.toString();
    }
  } catch (error) {
    console.error(error);
  }
});
