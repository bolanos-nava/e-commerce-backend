# Changes

## Carts

[ ] When a logged-in user tries to access a cart, validate that the user is the owner
[ ] Encode cart ids on the server so anonymous users can't guess the ids of other carts

## Sessions

[ ] User has no jwt and tries to access forbidden resource: show eror page
[ ] User has jwt, it expired and tries to access something requiring jwt: show error message like "Ha ocurrido un error, inténtelo de nuevo"
    This can be coded as an additional middleware that checks if an "UnauthorizedError" was thrown.
    Apply the middleware just to the views routers, so when the view loads and detects a TokenExpiredError, show error message as a Bootstrap Alert.
    If the user is in a page and does a request with the expired token, just show a Bootstrap alert that says "Ha ocurrido un error, refresque la página" and then the view router would take care of redirecting to home and showing the error message.
[ ] User has jwt, tries to access forbidden resource: show error page
[ ] If user is already logged-in, redirect to / when user enters /login