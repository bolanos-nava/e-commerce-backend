/* eslint-disable no-undef */
const {
  hostname,
  env: { WS_CLIENT_HOST, WS_CLIENT_PATH, USE_BUILT_IN_WS },
} = window;

const socket = USE_BUILT_IN_WS
  ? io()
  : io(WS_CLIENT_HOST, { path: WS_CLIENT_PATH });

console.log(`This came from ${hostname}`);

const productsList = document.getElementById('productsList');

function addProductToFrontend(data) {
  const product = productsList
    .getElementsByClassName('item')[0]
    .cloneNode(true);

  const productTitle = product.getElementsByClassName('product__title')[0];
  productTitle.innerText = data.title;

  const productDescription = product.getElementsByClassName(
    'product__description',
  )[0];
  productDescription.innerText = `Descripción: ${data.description}`;

  const productPrice = product.getElementsByClassName('product__price')[0];
  productPrice.innerText = `Precio: $${data.price.toFixed(2)}`;

  const productStock = product.getElementsByClassName('product__stock')[0];
  productStock.innerText = `Stock: ${data.stock}`;

  productsList.prepend(product);

  window.scrollTo({
    // top: document.body.scrollHeight,
    top: 0,
    behavior: 'smooth',
  });
}

Array.from(productsList.getElementsByClassName('item')).forEach((item) => {
  const productId = item.dataset.id;
  const btnDelete = item.getElementsByClassName('btn-delete');
  if (btnDelete.length) {
    btnDelete[0].addEventListener('click', async () => {
      try {
        const response = await fetch(`/api/v1/products/${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Reloads window
          window.location.reload();
        }
      } catch (error) {
        console.error('Prohibido borrar este producto');
      }
    });
  }
});

const productForm = document.getElementById('product-form');
productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // extracts data from form
  const productFormData = new FormData(productForm);

  // constructs new object from the form data
  const newProduct = {};
  productFormData.entries().forEach(([key, value]) => {
    newProduct[key] = value;
  });

  try {
    const response = await fetch('/api/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product: newProduct }),
    });
    const jsonResponse = await response.json();
    if (!response.ok) throw Error(jsonResponse.message);
    console.log(jsonResponse);
  } catch (error) {
    console.error(error);
  }
});

socket.on('new_product', (data) => {
  addProductToFrontend(data);
});
