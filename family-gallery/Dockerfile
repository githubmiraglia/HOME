# Build stage
FROM node:20-alpine as build

WORKDIR /app
COPY . .

# Install dependencies and build
RUN npm install && npm run build

# Serve stage
FROM nginx:alpine

# Copy built files to nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# ✅ Fix file and folder permissions so nginx can access them
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]