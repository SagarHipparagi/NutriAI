FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other project files
COPY . .

# Build the Next.js application
RUN npm run build

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the Next.js server
CMD ["npm", "start"]
