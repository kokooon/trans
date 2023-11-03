# STEP 1: Pull base image and defines variables
FROM node:lts-alpine
ARG APP_DIR=/app

# STEP 2: Install dependencies
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}
COPY ./package.json .

RUN npm cache clean --force
RUN npm install

# STEP 3: Retrieve configurations
# COPY ./.eslintrc.js .
COPY ./test/ .
# COPY ./nest-cli.json .
EXPOSE 3000

# STEP 4: Start the application
CMD ["npm", "run", "start:dev"]