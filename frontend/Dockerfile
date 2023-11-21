# STEP 1: Pull base image and defines variables
FROM node:lts-alpine
ARG APP_DIR=/app

# STEP 2: Install dependencies
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}
COPY ./package.json .
COPY ./package-lock.json .
COPY ./node_modules/ .

# RUN npm cache clean --force
RUN npm install

EXPOSE 3000

# STEP 3: Start the application
CMD ["npm", "start"]

