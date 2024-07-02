/* eslint-disable no-undef */
const socket = io();

function addProductToFrontend(data) {
  const productsList = document.getElementById('productsList');
  const product = productsList
    .getElementsByClassName('product')[0]
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

  productsList.appendChild(product);

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
}

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
