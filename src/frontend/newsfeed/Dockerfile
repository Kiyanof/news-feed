# ---- Base Node ----
    FROM node:14 AS base
    WORKDIR /app
    COPY package*.json ./
    
    # ---- Dependencies ----
    FROM base AS dependencies
    RUN npm install --force
    # later use npm CI
    
    # ---- Copy Files/Build ----
    FROM dependencies AS build
    COPY . .
    RUN npm run build
    
    # ---- Release ----
    FROM node:14-alpine AS release
    WORKDIR /app
    COPY --from=build /app/.next ./.next
    COPY --from=build /app/public ./public
    COPY --from=dependencies /app/node_modules ./node_modules
    EXPOSE 3000
    CMD ["npm", "start"]