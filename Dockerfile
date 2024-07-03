# Dockerfile

# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy wait-for-it.sh into the container
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh

# Grant execute permissions to wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD npx prisma migrate deploy && npm run start:prod