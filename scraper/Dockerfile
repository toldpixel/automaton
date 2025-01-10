# Use an official Node.js runtime as a parent image
FROM node:20.9.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Plawright dependencies
RUN npx playwright install --with-deps

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 6666

# Command to run the app
CMD ["npm", "run", "start"]