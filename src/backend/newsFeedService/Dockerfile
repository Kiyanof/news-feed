# ---- Base Node ----
    FROM node:lts AS base
    WORKDIR /app
    COPY package*.json ./
    COPY modules ./modules
    
    # ---- Dependencies ----
    FROM base AS dependencies
    RUN npm install 
    # later use npm CI
    
    # ---- Build ----
    FROM dependencies AS build
    COPY . .
    RUN npm run build
    
    # ---- Release ----
    FROM node:lts-alpine AS release
    WORKDIR /app
    COPY --from=build /app/dist ./dist
    COPY --from=dependencies /app/node_modules ./node_modules
    EXPOSE 8005
    CMD ["node", "dist/server.js"]