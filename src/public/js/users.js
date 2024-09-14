const successAlert = document.getElementById('successAlert');
const alertSpan = document.getElementById('alertSpan');

document
  .getElementById('btnDeleteInactiveUsers')
  .addEventListener('click', async () => {
    const response = await fetch('/api/v1/users', { method: 'DELETE' });

    if (response.ok) {
      const jsonResponse = await response.json();
      alertSpan.textContent = `Se han borrado ${jsonResponse.payload.numUsersDeleted} usuarios inactivos.`;
      successAlert.classList.remove('d-none');
    }
  });

document.getElementById('btnSuccessAlert').addEventListener('click', () => {
  successAlert.classList.add('d-none');
});
