FROM node:18

WORKDIR /app

# Copy package files
COPY package.json ./

# Copy everything else
COPY . .

# Remove any existing lockfiles or node_modules to prevent cross-OS compatibility issues
RUN rm -rf package-lock.json node_modules

# Install dependencies fresh
RUN npm install --legacy-peer-deps

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application
RUN npm run build

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the Next.js server
CMD ["npm", "start"]
