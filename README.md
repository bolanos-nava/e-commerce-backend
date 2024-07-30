# Proyecto final del curso de backend de Coderhouse

Repositorio para alojar el proyecto final del curso de backend. El código fuente se encuentra en la subcarpeta `/src`

## Correr aplicación

### Despliegue local

Primeramente se deben configurar las variables de ambiente:

|     Variable     |             ¿Requerida?              |    Valor default    |                                       Descripción                                       |
| :--------------: | :----------------------------------: | :-----------------: | :-------------------------------------------------------------------------------------: |
|     NODE_ENV     |                  NO                  |     dev \| prod     |                           Valor para el ambiente del poryecto                           |
|   SERVER_PORT    |                  NO                  |        8080         |                   Valor del puerto en el que se servirá la aplicación                   |
| MONGO_DEPLOYMENT |                  NO                  |   local \| atlas    |            Si se quiere usar MongoDB local o un clúster de Atlas en la nube             |
|      DB_URI      | SI (para despliegue con Mongo Atlas) |                     | String de conexión para Mongo Atlas. Solo requerido en caso de `MONGO_DEPLOYMENT=atlas` |
|     DB_HOST      |                  NO                  | mongodb://localhost |                                Host de la base de datos                                 |
|     DB_PORT      |                  NO                  |        27017        |                        Puerto para conectarse a la base de datos                        |
|     DB_NAME      |                  NO                  |      ecommerce      |                               Nombre de la base de datos                                |
| JWT_PRIVATE_KEY  |                  SI                  |                     |                             Llave privada par firmar el JWT                             |


Ejemplo mínimo para despliegue local con Mongo local:

```plaintext
# .env
SERVER_PORT=8080
JWT_PRIVATE_KEY=<string_secreta>
```

Ejemplo mínimo para despliegue local usando Mongo Atlas:

```plaintext
# .env.atlas
SERVER_PORT=8080
DB_URI=<atlas connection string>
JWT_PRIVATE_KEY=<string_secreta>
```

Pasos para correr localmente:

1. `npm i` para instalar dependencias
2. `npm run local` si queremos utilizar el archivo `.env`
3. `npm run atlas` si queremos utilizar el archivo `.env.atlas`

Alternativamente, podemos añadir `:watch` al final de los comandos anteriores para activar el hot reload.

### Despliegue en contenedores (Docker y Kubernetes)

|      Variable       |               ¿Requerida?                |  Valor default  |                                                     Descripción                                                     |
| :-----------------: | :--------------------------------------: | :-------------: | :-----------------------------------------------------------------------------------------------------------------: |
|      NODE_ENV       |                    NO                    |       dev       |                                         Valor para el ambiente del proyecto                                         |
|     SERVER_PORT     |                    NO                    |      8080       |                       Puerto donde se servirá la aplicación de Express dentro del contenedor                        |
|      HOST_PORT      |                    NO                    |      8080       |                           Puerto que el servicio de Express expondrá a la máquina huésped                           |
|       DB_URI        |                    NO                    |                 |                                        String de conexión para MongoDB Atlas                                        |
|       DB_HOST       |                    NO                    | mongodb://mongo | Host al que se conectará la base de datos. Debe resolverse al nombre del servicio definido en `docker-compose.yaml` |
|       DB_PORT       |                    NO                    |      27017      |                                  Puerto de la base de datos dentro del contenedor                                   |
|    HOST_DB_PORT     |                    NO                    |      27017      |                      Puerto que el servicio de la base de datos expondrá a la máquina huésped                       |
|       DB_NAME       |                    NO                    |    ecommerce    |                                             Nombre de la base de datos                                              |
| DB_REPLICA_SET_NAME | SÍ (en caso de estar usando replica set) |                 |                    Nombre del replica set, usada en caso de desplegar un replica set de MongoDB                     |
|   JWT_PRIVATE_KEY   |                    SI                    |                 |                                          Llave privada para firmar el JWT                                           |

#### Correr aplicación Docker

Para Docker, crear archivo `.env.docker`. Este archivo se usará dentro del `docker-compose.yaml` para levantar los servicios. Ejemplo mínimo de `.env.docker`:

```plaintext
# .env.docker
DB_HOST=mongodb://mongo
JWT_PRIVATE_KEY=<string_secreta>
```

Finalmente, correr `docker compose --env-file=.env.docker up`.

#### Kubernetes

El despliegue en Kubernetes despliega un replica set de MongoDB en la forma de un StatefulSet de Kubernetes, por defecto.

Ejemplo mínimo de archivo `.env.k8s`:

```plaintext
DB_REPLICA_SET_NAME=rs0
JWT_PRIVATE_KEY=<string_secreta>
```

Ahora se debe crear un secreto genérico de nombre `env-server` a partir del archivo `.env.k8s` con el siguiente comando:

```shell
kubectl create secret generic env-server --from-env-file=.env.k8s
```

Después ya se pueden comenzar a crear los recursos de Kubernetes de la carpeta `k8s`

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

Se utiliza MongoDB, que puede servirse localmente o por medio de un clúster de base de datos en MongoDB Atlas. También se puede desplegar un replica set de MongoDB como un statefulset en un clúster de Kubernetes

## Pruebas

Se incluyen archivos de cliente HTTP en los archivos `*.client.http`. Para usarlos, basta con instalar en VSCode la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) y el archivo se actualizará con botones que permiten enviar los pedidos.
