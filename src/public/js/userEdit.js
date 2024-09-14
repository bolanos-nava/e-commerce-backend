const roleField = document.getElementById('role');
roleField.value = roleField.dataset.value;

const editForm = document.getElementById('editForm');
const successAlert = document.getElementById('successAlert');

document.getElementById('btnSuccessAlert').addEventListener('click', () => {
  successAlert.classList.add('d-none');
});
editForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const role = roleField.value;

  const response = await fetch(
    `/api/v1/users/${document.getElementById('main').dataset.userId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { role } }),
    },
  );
  if (response.ok) {
    successAlert.classList.remove('d-none');
  }
});
