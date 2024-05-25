#!/bin/bash

# List of directories
dirs=(
  "./../modules/logger/"
  "./../rabbitmq/"
  "./../tokenizer/"
  "./../producers/content/"
  "./../news/"
  "./../notification/"
  "./../subscription/"
)

for dir in "${dirs[@]}"; do
  if [ -d "$dir" ]; then
    echo "Processing $dir"
    cd "$dir" || exit
    npm install
    npm run build
  else
    echo "$dir does not exist"
  fi
done

pwd # Print the current working directory
cd ./../..

services=("contentService" "userService" "newsFeedService" "notificationService" "subscriptionService")

# Iterate over each service in the services array
for service in "${services[@]}"; do
  # Check if the service directory exists
  if [ -d "../$service" ]; then
    mkdir -p "../$service/modules"
    # Copy the directory to the target location
    cp -r "../modules/"* "../$service/modules"
    echo "Copied modules to $service"
  else
    echo "Directory $service does not exist"
  fi
done