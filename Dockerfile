# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the backend and frontend code
COPY backend ./backend

# Set working directory to backend
WORKDIR /app/backend

# Copy the public folder
COPY frontend ./public

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "app.js"]
