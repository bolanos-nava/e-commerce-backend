const params = new URLSearchParams(window.location.search);
const errorParam = params.get('error');
if (errorParam.toLowerCase() === 'bad_form') {
  document.getElementById('errorAlert').classList.remove('d-none');
}
