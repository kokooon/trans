# STEP 1: Pull base image and defines variables
FROM node:lts-alpine
ARG APP_DIR=/app

# STEP 2: Install dependencies
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# RUN rm -rf node_modules
# RUN npm cache clean --force
# RUN npm install -g npm@10.2.4
# # RUN npm update
# RUN npm install -g @nestjs/cli
# RUN npm install typescript@latest
# RUN npm install @nestjs/typeorm typeorm pg
# RUN npm install --save @nestjs/config
# RUN npm install @nestjs/passport passport-42

# COPY ./nest-cli.json .
EXPOSE 3000

# STEP 4: Run migrations
#RUN npm run typeorm migration:generate -- -d ./ormconfig.ts
#RUN npm run typeorm migration:run

# STEP 5: Start the application
CMD ["npm", "run", "start:dev", "--", "--exit-code"]