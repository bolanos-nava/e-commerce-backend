# Further steps

**Cart responsibilities:**

- When adding product, forbid to add a quantity bigger than the stock of the product (endpoint POST /:cartId/products/:productId)
- The cart shouldn't keep track of which products exist and which don't. Would be an expensive operation
- Show its own products. Two nested responsibilities:
  - Check if some of the added quantities are more than the available stock. The cart, then, updates the exceeding quantities to be equal to the available stock.
  - If some product can't be populated it means that it was deleted from the database and it can be deleted from the cart as well.
  - If some product has status "false", it shouldn't be deleted from the cart, just marked as "unavailable" in the frontend.

**Product responsibilities**:

- If a product is physically deleted:
  - It won't be removed from the carts in which it appears. It's the cart's responsibility to keep track of its products.
  - It will be deleted from the category it belongs to.
- We will try to avoid physically deleting a product. To signal a logical deletion we mark the product with status = false.

**Categories-products (one-to-many):**

In a relational database you would have a categories table with id, name and codename, and a products table with a category_id field that is a foreign key to the categories table. 

In a MongoDB design duplicity is key:

- A product document has a field "category", which stores a ref to a category document.
- The category document has fields "name", "codename" and "products". A category stores all its products.

In this kind of architecture, we are defining that the category has the responsibility of describing its products. If we model this as a relational database, then to find all products within one category you would have to ask the product (find all products with category X), but with the MongoDB architecture, the product has the responsibility of describing its own category and the category of keeping record of its own product.

Architecture:

- Mongoose models: they work as DAOs and models. They interact directly with the database but can also store business logic in custom static and instance methods.
- Controllers: they serve as the managers. They receive the requests, call the model and then return the response.
- Routers: they just take care of defining the route and the controller action to call.


## Frontend

**Create a cart**:

- A cart will be created when the frontend sends a POST request to the `/api/v1/carts` and the cartId will be saved in localStorage. In further requests the cartId associated with the current session will be fetched from there. That request could be sent in two ways:
  1. When the user wants to add a product to a cart
  2. When the user wants to access a cart.
- To add a product to the cart there will be two ways to do it:
  1. From the product detail view or from the list of products the frontend sends a request to the backend that calls the action `CrtsController#addProduct`, because the frontend doesn't know if the product it is attempting to add already exists in the cart or not. The `#addProduct` action has the logic to add the product or only increase its quantity.
  2. From the cart view, the frontend will send a request to the `CartsController#updateQuantity` action to only change the quantity. There will be two ways of sending the quantity, absolute or incremental. Incremental means to increase or decrease quantity (one by one) and absolute means to send the absolute quantity to put in the product.
