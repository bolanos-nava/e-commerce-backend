# Proyecto final del curso de backend de Coderhouse

Repositorio para alojar el proyecto final del curso de backend. El código fuente se encuentra en la subcarpeta `/src`

## Variables de ambiente

Se incluye el archivo `.env.schema` que contiene las variables de ambiente que se deben tener en los archivo `.env` o `.env.cloud`.

Ejemplo para despliegue local (archivo `.env`):

```plaintext
# .env
NODE_ENV=dev
SERVER_PORT=8080
DB_HOST=mongodb://localhost
DB_PORT=27017
DB_NAME=ecommerce
JWT_PRIVATE_KEY=string_secreta
PERSISTENCE=MONGO
```

Ejemplo para despliegue en MongoDB Atlas (archivo `.env.cloud`):

```plaintext
# .env.atlas
NODE_ENV=dev
SERVER_PORT=8080
DB_URI=<atlas connection string>
DB_NAME=ecommerce
JWT_PRIVATE_KEY=string_secreta
PERSISTENCE=MONGO
```

## Iniciar aplicación

### MongoDB local

1. Correr `npm i` para instalar dependencias.
2. Crear archivo `.env`
3. Correr `npm run dev` para iniciar el servidor y servir localmente la base de datos. 
4. Abrir http://localhost:8080 para ver el frontend, o bien enviar pedidos con un cliente headless como Postman.

### MongoDB Atlas

1. Correr `npm i` para instalar dependencias.
2. Crear archivo `.env.cloud`
3. Correr `npm run cloud` para iniciar el servidor y conectarse a MongoDB Atlas.
4. Abrir http://localhost:8080 para visualizar el frontend, o bien enviar pedidos con un cliente headless como Postman.

## Rutas

### Frontend

El frontend está implementado por medio de vistas hechas con plantillas de handlebars.

Rutas de frontend:

- Lista de productos: [Ruta raíz](http://localhost:8080), que incluye paginación.
- Lista de productos que se actualiza en tiempo real: [/realtimeproducts](http://localhost:8080/realtimeproducts) 
- Chat en tiempo real: [/chat](http://localhost:8080/chat)
- Registro: [/register](http://localhost:8080/register)
- Inicio de sesión: [/login](http://localhost:8080/login)

**Nota:** Para la ruta del carrito, es necesario usar el botón "Carrito" del frontend para crear un carrito en la base de datos, que su id se guarde en localStorage y posteriormente acceder a la ruta http://localhost:8080/cart/:cartId usando ese id.

### Backend

Se cuenta con dos endpoints en las siguientes rutas:

- Productos: [/api/v1/products](http://localhost:8080/api/v1/products)
- Carritos: [/api/v1/carts](http://localhost:8080/api/v1/carts).

### Base de datos

Se utiliza MongoDB, que puede servirse localmente o por medio de un clúster de base de datos en MongoDB Atlas.

## Pruebas

Se incluyen archivos de cliente HTTP en los archivos `*.client.http`. Para usarlos, basta con instalar en VSCode la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) y el archivo se actualizará con botones que permiten enviar los pedidos.
