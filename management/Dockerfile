
# Use an official Node.js runtime as a parent image
FROM node:20.9.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if needed)
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["npm", "run", "start"]