### Containerized REST API
## This image does all the necessary operations to install Node packages and run the server
# Pulling Node image from Docker Hub
FROM node:lts-alpine3.19

RUN apk add --no-cache curl

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i --omit-dev

COPY . .
CMD ["npm", "run", "server"]