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
  productDescription.innerText = data.description;

  const productPrice = product.getElementsByClassName('product__price')[0];
  productPrice.innerText = `$${data.price.toFixed(2)}`;

  productsList.appendChild(product);

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
}

socket.on('new_product', (data) => {
  addProductToFrontend(data);
});
