# STEP 1: Pull base image and defines variables
FROM node:lts-alpine
ARG APP_DIR=/app

# STEP 2: Install dependencies
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}
COPY package.json .
RUN npm cache clean --force
RUN npm install
RUN npm install typescript @types/react @types/react-dom

EXPOSE 3000

# STEP 3: Start the application
CMD ["npm", "start"]