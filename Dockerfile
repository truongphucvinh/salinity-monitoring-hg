# Use an official Node.js runtime as the base image
FROM node:latest

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY ./package.json ./
RUN npm i

# Uninstalling and installing specific versions of packages
RUN npm uninstall @coreui/react
RUN npm install @coreui/react@5.0.0-rc.0

# Copying all the files in our project
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]