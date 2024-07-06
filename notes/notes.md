# Further steps

**Cart responsibilities:**

- [ ] When adding product, forbid to add a quantity bigger than the stock of the product (endpoint POST /:cartId/products/:productId)
- [X] The cart shouldn't update when a product is deleted. Would be an expensive operation.
- Show its own products. Two nested responsibilities:
  - [x] If some product can't be populated it means that it was deleted from the database and it can be deleted from the cart as well.
  - [ ] If some product has status "false", it shouldn't be deleted from the cart, just marked as "unavailable" in the frontend (the throws error in backend but doesn't show error on frontend yet.)

**Product responsibilities**:

- If a product is physically deleted:
  - [X] It won't be removed from the carts in which it appears. It's the cart's responsibility to keep track of its products.
  - [ ] It will be deleted from the category it belongs to.
- [ ] We will try to avoid physically deleting a product. To signal a logical deletion we mark the product with status = false.

**Categories-products (one-to-many):**

In a relational database you would have a categories table with id, name and codename, and a products table with a category_id field that is a foreign key to the categories table. 

In a MongoDB design duplicity is key:

- A product document has a field "category", which stores a ref to a category document.
- The category document has fields "name", "codename" and "products". A category stores all its products.

In this kind of architecture, we are defining that the category has the responsibility of describing its products. If we model this as a relational database, then to find all products within one category you would have to ask the product (find all products with category X), but with the MongoDB architecture, the product has the responsibility of describing its own category and the category of keeping record of its own product.

Architecture:

- Mongoose models: They interact directly with the database but can also store business logic in custom static and instance methods.
- DAO: contain logic to access the models. The use of this layer is to have an abstraction between the controllers and the models and be able to reuse some of the logic defined here in different controllers, if needed.
- DAOFactory: the DAOFactory selects a set of DAOs (e.g. FS DAOs, Mongo DAOs, in-memory DAOs, etc) based on an environment variable.
- Services: the services call the methods of the DAOs that the DAOFactory returned. It is a further abstraction to have a focus point for the DAO methods. The use of this is, for example, calling logic that has to be reused among different DAOs.
- Controllers: They receive the requests, call the services and return the response to the client.
- Routers: they just take care of defining the paths and the controller action to call.

## Frontend

**Create a cart**:

- [x] A cart will be created when the frontend sends a POST request to the `/api/v1/carts` and the cartId will be saved in localStorage. In further requests the cartId associated with the current session will be fetched from there. That `POST` request could be sent in two ways:
  1. When the user wants to add a product to a cart
  2. When the user wants to access a cart.
- To add a product to the cart there will be two ways to do it:
  1. From the product detail view or from the list of products the frontend sends a request to the backend that calls the action `CrtsController#addProduct`, because the frontend doesn't know if the product it is attempting to add already exists in the cart or not. The `#addProduct` action has the logic to add the product or only increase its quantity.
  2. From the cart view, the frontend will send a request to the `CartsController#updateQuantity` action to only change the quantity. There will be two ways of sending the quantity, absolute or incremental. Incremental means to increase or decrease quantity (one by one) and absolute means to send the absolute quantity to put in the product.

**Show cart**:

- [ ] When user enters the cart view and some product has more added quantity than its available stock, show a message that tells the user to update the product.
- [ ] Block "Go to checkout" button until the user has updated the cart products' quantities.

## Futher notes

[ ] Add pagination to products of cart
[ ] Add codes to errors
[ ] Standardize responses
[ ] Add categories collection
[ ] Add SweetAlert to show popup when a product is added to cart
[ ] Encode cartId in base64 so a user doesn't know how to access to a cart different than the one saved in local storage
[ ] Associate cart with a user

## Carts

A cart will have a "userId" field, and a user will have a "cartId" field. When an anonymous user (i.e. the one that hasn't logged-in to the site) adds products to cart, the cartId will be stored in LocalStorage and won't have a userId yet. When the user logs in, the user is assigned as the userId of the cart, and the cart is assigned as the cartId of the user. 

Let's say that a user already has a cart, but the user accesses the site without logging in. The user adds products to the anonymous cart and then logs in. In that case, the products of the anonymous cart should be added to the products of the user's cart with the addProductsToCart.

## Checkout

The checkout should show the cart again. The only reliable way of making the backend safe towards inconsistencies (i.e. creating a ticket with a product that has more quantity than available) is by checking the quantity at the time of checkout, when the user clicks on "Finish purchase". This action will call a "createTicket()" endpoint (POST /tickets) and will check if the quantity of every product being attempted to be added doesn't exceed the available stock. 

The products with quantities that exceed the stock will stay in the cart, will not be added to the ticket. In the case that there are products that couldn't be added to the ticket, the server should send a response that says that not all products were added to the cart.