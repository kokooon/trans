# STEP 1: Pull base image and defines variables
FROM node:lts-alpine
ARG APP_DIR=/app

# STEP 2: Install dependencies
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}
#COPY ./nest-cli.json /app
#COPY ./package.json /app
#COPY ./package-lock.json /app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]