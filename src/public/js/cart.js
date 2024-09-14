import { DIRECTION_ENUM } from './utils/cartUtils.js';

const cartId = JSON.parse(localStorage.getItem('user'))?.cart;

async function sendDeleteRequest(productId) {
  try {
    const response = await fetch(
      `/api/v1/carts/${cartId}/products/${productId}`,
      { method: 'DELETE' },
    );
    return response.ok;
  } catch (error) {
    console.error(error);
  }

  return false;
}

async function sendChangeQuantityRequest(
  productId,
  quantity,
  direction,
  stock,
) {
  if (direction === DIRECTION_ENUM['+'] && quantity > stock) {
    throw Error("Quantity can't be greater than available stock");
  }
  try {
    const response = await fetch(
      `/api/v1/carts/${cartId}/products/${productId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      },
    );
    return response.ok;
  } catch (error) {
    console.error(error);
  }

  return false;
}

function main() {
  const productsItems = document.querySelectorAll('.products__list .item');
  const btnCheckout = document.getElementById('btnCheckout');

  if (!localStorage.getItem('isLogged')) {
    // TODO: show warning message that checkout can only be done when logged in
    btnCheckout.setAttribute('disabled', true);
  } else {
    btnCheckout.addEventListener('click', async () => {
      try {
        const response = await fetch(`/api/v1/carts/${cartId}/tickets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.status === 201) {
          const responseJson = await response.json();
          window.location = `/tickets/${responseJson.payload.ticket._id}/success`;
        }
        const respJson = await response.json();
      } catch (error) {
        console.error(error);
      }
    });
  }

  productsItems.forEach((productItem) => {
    const { id: productId, stock } = productItem.dataset;
    const btnMinus = productItem.querySelector('.btn-minus-qty');
    const btnPlus = productItem.querySelector('.btn-plus-qty');
    const quantityDisplay = productItem.querySelector('.quantity-display');

    if (Number(quantityDisplay.textContent) <= 0)
      btnMinus.addAttribute('disabled', true);
    if (Number(quantityDisplay.textContent) >= stock)
      btnPlus.setAttribute('disabled', true);

    const quantityChangeBtnHandler = async (_quantity, direction) => {
      const quantity = _quantity + direction;
      if (quantity === 0) {
        const isProductDeleted = sendDeleteRequest(cartId, productId);
        if (isProductDeleted) productItem.remove();
        return;
      }
      const isResponseOk = await sendChangeQuantityRequest(
        productId,
        quantity,
        direction,
        stock,
      );
      if (!isResponseOk) return;

      if (
        (direction === DIRECTION_ENUM['-'] && quantity > 0) ||
        (direction === DIRECTION_ENUM['+'] && quantity <= stock)
      ) {
        quantityDisplay.textContent = quantity;
      }
    };

    btnMinus.addEventListener('click', async () => {
      let quantity = Number(quantityDisplay.textContent);
      await quantityChangeBtnHandler(quantity, DIRECTION_ENUM['-']);

      quantity = Number(quantityDisplay.textContent);
      if (quantity <= 0) btnMinus.setAttribute('disabled', true);
      else btnMinus.removeAttribute('disabled');
      if (quantity < stock) btnPlus.removeAttribute('disabled');
    });
    btnPlus.addEventListener('click', async () => {
      let quantity = Number(quantityDisplay.textContent);
      await quantityChangeBtnHandler(quantity, DIRECTION_ENUM['+']);

      quantity = Number(quantityDisplay.textContent);
      if (quantity >= stock) btnPlus.setAttribute('disabled', true);
      else btnPlus.removeAttribute('disabled');
      if (quantity > 0) btnMinus.removeAttribute('disabled');
    });
  });
}

main();
