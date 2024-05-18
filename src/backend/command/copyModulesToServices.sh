#!/bin/bash

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