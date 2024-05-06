# Further steps

Cart responsibilities:

- Delete product from cart when the product no longer exists (endpoint GET /:cartId/products)
- Check stock of product and forbid that a product has a quantity greater than the stock (endpoint POST /:cartId/products/:productId checks the stock before adding product/changing quantity; endpoint GET /:cartId/products should check stock of products as well)