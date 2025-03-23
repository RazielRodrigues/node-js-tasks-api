# Use the Node LTS image
FROM node:latest

# Set the working directory
WORKDIR /

# Copy only package.json and package-lock.json first for caching
COPY ./app/package*.json ./
COPY ./app/.env ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./ .

# Expose the default Vite port (change if needed)
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "start"]
