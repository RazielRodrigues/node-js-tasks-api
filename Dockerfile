# Use the Node LTS image
FROM node:latest

# Set the working directory
WORKDIR /api

# Copy only package.json and package-lock.json first for caching
COPY ./api/package*.json ./
COPY ./api/.env.local ./.env

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./api .

# Expose the default port (change if needed)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]