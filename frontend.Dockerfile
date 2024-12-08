# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the React application
COPY frontend/ .

# Build the application
RUN npm run build

# Expose the React port
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
