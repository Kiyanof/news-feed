# ---- Base Node ----
    FROM node:20-buster-slim AS base
    WORKDIR /app
    COPY package*.json ./
    COPY ./modules ./modules
    
    # ---- Dependencies ----
    FROM base AS dependencies
    RUN npm install 
    # later use npm CI

    # ---- Build ----
    FROM dependencies AS build
    COPY . .
    RUN npm run build
    COPY ./src/lib/python ./dist/lib/python

    # ---- Python Builder ----
    FROM debian:buster AS python-builder
    RUN apt-get update && apt-get upgrade -y && \
        apt-get install -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev curl libbz2-dev && \
        curl -O https://www.python.org/ftp/python/3.11.0/Python-3.11.0.tar.xz && \
        tar -xf Python-3.11.0.tar.xz && \
        cd Python-3.11.0 && \
        ./configure --enable-optimizations --enable-shared && \
        make -j 4 && \
        make altinstall && \
        ldconfig && \
        curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
        python3.11 get-pip.py && \
        rm -rf /var/lib/apt/lists/*

    
    # ---- Release ----
    FROM node:20-buster AS release
    RUN apt-get update && \
        apt-get install -y netcat && \
        rm -rf /var/lib/apt/lists/*
    COPY --from=python-builder /usr/local /usr/local
    ENV LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
    WORKDIR /app
    COPY --from=build /app/dist ./dist
    COPY --from=dependencies /app/node_modules ./node_modules
    RUN pip3 install --upgrade pip && pip3 install fastembed

    EXPOSE 8005

