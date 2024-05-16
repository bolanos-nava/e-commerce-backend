/* eslint-disable no-param-reassign */
const { env } = window;
const DIRECTION = {
  '+': +1,
  '-': -1,
};

function changeQuantity(_direction, quantityText, stock) {
  const direction = DIRECTION[_direction];

  const quantity = Number(quantityText.textContent);
  console.log(quantity + direction);
  if (quantity + direction >= 0 && quantity + direction <= stock) {
    quantityText.textContent = quantity + direction;
  }
}

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

async function main() {
  attatchListenerToCartButton();
  const productsItems = document.querySelectorAll('.products__list .item');

  productsItems.forEach((productItem) => {
    const btnMinus = productItem.querySelector('.btn-minus-qty');
    const btnPlus = productItem.querySelector('.btn-plus-qty');
    const quantityText = productItem.querySelector('.quantity-display');
    const btnAddToCart = productItem.querySelector('.btn-add-to-cart');
    const stockText = productItem.querySelector('.product__stock');

    const stock = Number(stockText.textContent.split('Stock: ')[1]);

    btnMinus.addEventListener('click', () =>
      changeQuantity('-', quantityText, stock),
    );
    btnPlus.addEventListener('click', () =>
      changeQuantity('+', quantityText, stock),
    );
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
          body: JSON.stringify({ quantity: quantityText.textContent }),
        },
      );
      const jsonResponse = await response.json();
    });
  });
}

main();
