# Use the official Node.js 14 image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json .
COPY pnpm-lock.yaml .

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies
RUN pnpm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that your Vite application will run on
EXPOSE 3000

# Command to start the application
CMD ["pnpm", "dev", "--host"]
