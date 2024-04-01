# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY image_server/package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code into the working directory
COPY image_server/ .

# Make port 3003 available outside the container
EXPOSE 3003

# Define the command to run the application
CMD [ "npm", "start" ]