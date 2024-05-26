/* eslint-disable no-param-reassign */

const { env, pagination } = window;

function attatchListenerToCartButton() {
  const btnCart = document.getElementById('btnCart');
  btnCart.addEventListener('click', async () => {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      let cartCreationResponse = await fetch(
        `${env.API_URL}:${env.PORT}/api/v1/carts`,
        { method: 'POST' },
      );
      cartCreationResponse = await cartCreationResponse.json();
      cartId = cartCreationResponse.payload.cart._id;
      localStorage.setItem('cartId', cartId);
    }

    window.location.href = `/cart/${cartId}`;
  });
}

function changeQueryParams(key, value) {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  window.location.search = params.toString();
}

async function main() {
  attatchListenerToCartButton();
  const productsItems = document.querySelectorAll('.products__list .item');

  const btnPrevPage = document.querySelector('#btnPrevPage');
  const btnNextPage = document.querySelector('#btnNextPage');

  if (pagination.hasPrevPage) {
    btnPrevPage.addEventListener('click', () => {
      changeQueryParams('page', pagination.prevPage);
    });
  }
  if (pagination.hasNextPage) {
    btnNextPage.addEventListener('click', () => {
      changeQueryParams('page', pagination.nextPage);
    });
  }

  productsItems.forEach((productItem) => {
    const btnMinus = productItem.querySelector('.btn-minus-qty');
    const btnPlus = productItem.querySelector('.btn-plus-qty');
    const quantityDisplay = productItem.querySelector('.quantity-display');
    const btnAddToCart = productItem.querySelector('.btn-add-to-cart');
    const stockText = productItem.querySelector('.product__stock');

    const stock = Number(stockText.textContent);

    const changeDisplayedQuantity = (quantity, quantityDisplayElement) => {
      if (quantity > 0 && quantity <= stock) {
        quantityDisplayElement.textContent = quantity;
      }
    };

    btnMinus.addEventListener('click', () => {
      let quantity = Number(quantityDisplay.textContent);
      changeDisplayedQuantity(quantity - 1, quantityDisplay);

      quantity = Number(quantityDisplay.textContent);
      if (quantity <= 0) btnMinus.setAttribute('disabled', true);
      else btnMinus.removeAttribute('disabled');
      if (quantity < stock) btnPlus.removeAttribute('disabled');
    });
    btnPlus.addEventListener('click', () => {
      let quantity = Number(quantityDisplay.textContent);
      changeDisplayedQuantity(quantity + 1, quantityDisplay);

      quantity = Number(quantityDisplay.textContent);
      if (quantity >= stock) btnPlus.setAttribute('disabled', true);
      else btnPlus.removeAttribute('disabled');
      if (quantity > 0) btnMinus.removeAttribute('disabled');
    });

    btnAddToCart.addEventListener('click', async () => {
      let cartId = localStorage.getItem('cartId');
      if (!cartId) {
        let cartCreationResponse = await fetch(
          `${env.API_URL}:${env.PORT}/api/v1/carts`,
          { method: 'POST' },
        );
        cartCreationResponse = await cartCreationResponse.json();
        cartId = cartCreationResponse.payload.cart._id;
        localStorage.setItem('cartId', cartId);
      }

      const response = await fetch(
        `${env.API_URL}:${env.PORT}/api/v1/carts/${cartId}/products/${productItem.dataset.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: quantityDisplay.textContent }),
        },
      );
      const jsonResponse = await response.json();
    });
  });
}

main();
