### Containerized REST API
## This image does all the necessary operations to install Node packages and run the server
# Pulling Node image from Docker Hub
FROM node:lts-alpine3.19

# BUILD ARGS can be set up dynamically during build and are only accessible during this phase,
# not when running the container.
# ENV variables stay in the image after build phase, so we can access them when running the container.
# To set them up dynamically, we can combine the use of ARGS + ENV
# ARG ENVIRONMENT=development
# ENV ENV=${ENVIRONMENT}

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i --omit-dev

COPY . .
CMD ["npm", "run", "server"]