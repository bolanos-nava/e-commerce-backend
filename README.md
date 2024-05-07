# Proyecto final del curso de backend de Coderhouse

Repositorio para alojar el proyecto final del curso de backend. El código fuente se encuentra en la subcarpeta `/src`

## Iniciar aplicación

Para iniciar el proyecto:

1. Correr `npm i` para instalar dependencias.
2. Correr `npm run cloud` para iniciar el servidor y conectarse a la base de datos en la nube.
3. Abrir http://localhost:8080 para ver el frontend, o bien enviar pedidos a la API con un cliente, como puede ser Postman.

## Rutas

### Frontend

El frontend está implementado por medio de vistas hechas con plantillas de handlebars.
Rutas de frontend:

- Lista de productos: [Ruta raíz](http://localhost:8080) 
- Lista de productos que se actualiza en tiempo real: [/realtimeproducts](http://localhost:8080/realtimeproducts) 
- Chat en tiempo real: [/chat](http://localhost:8080/chat)

### Backend

Se cuenta con dos endpoints de backend en las siguientes rutas:

- Productos: [/api/v1/products](http://localhost:8080/api/v1/products)
- Carritos: [/api/v1/carts](http://localhost:8080/api/v1/carts).

### Base de datos

Se implementa un clúster de base de datos en MongoDB Atlas.

## Pruebas

Se incluye un cliente HTTP simple en el archivo `client.http`. Para usarlo, basta con instalar la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) y el archivo se actualizará con botones que permiten enviar los pedidos.
