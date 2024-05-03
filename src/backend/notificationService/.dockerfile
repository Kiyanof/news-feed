# Use an official Node.js runtime as the base image
# TODO: Use a specific version of Node.js
FROM node:latest 

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Install TypeScript and other build tools
RUN npm install -g typescript ts-node @types/node

# Compile TypeScript code
RUN npx tsc

# Make port 8004 available to the world outside this container
EXPOSE 8004

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "dist/index.js"]
