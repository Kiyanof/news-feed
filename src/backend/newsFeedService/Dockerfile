# ---- Base Node ----
    FROM node:lts AS base
    WORKDIR /app
    COPY package*.json ./
    COPY ./modules ./modules
    
    # ---- Dependencies ----
    FROM base AS dependencies
    RUN npm install 
    # later use npm CI

    # ---- Python ----
    FROM dependencies AS python
    RUN apk add --no-cache python3
    
    # ---- Build ----
    FROM python AS build
    COPY . .
    RUN npm run build

    # ---- Copy Python Directory ----
    COPY ./src/lib/python ./dist/lib/python
    
    # ---- Release ----
    FROM node:lts-alpine AS release
    WORKDIR /app
    COPY --from=build /app/dist ./dist
    COPY --from=dependencies /app/node_modules ./node_modules
    EXPOSE 8005
    CMD ["node", "dist/server.js"]