const params = new URLSearchParams(window.location.search);
const errorParam = params.get('error')?.toLowerCase();
if (errorParam === 'bad_credentials') {
  document.getElementById('errorAlert').classList.remove('d-none');
}
