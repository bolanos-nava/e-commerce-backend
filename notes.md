# Further steps

Cart responsibilities:

- Delete product from cart when the product no longer exists (endpoint GET /:cartId/products)
- Check stock of product and forbid that a product has a quantity greater than the stock (endpoint POST /:cartId/products/:productId checks the stock before adding product/changing quantity; endpoint GET /:cartId/products should check stock of products as well)

Categories-products (one-to-many):

In a relational database you would have a categories table with id, name and codename, and a products table with a category_id field that is a foreign key to the categories table. 

In a MongoDB design duplicity is key:

- A product document has a field "category", which stores a ref to a category document.
- The category document has fields "name", "codename" and "products". A category stores all its products.

In this kind of architecture, we are defining that the category has the responsibility of describing its products. If we model this as a relational database, then to find all products within one category you would have to ask the product (find all products with category X), but with the MongoDB architecture, the product has the responsibility of describing its own category and the category of keeping record of its own product.

Architecture:

- Mongoose models: they work as DAOs and models. They interact directly with the database but can also store business logic in custom static and instance methods.
- Controllers: they serve as the managers. They receive the requests, call the model and then return the response.
- Routers: they just take care of defining the route and the controller action to call.
