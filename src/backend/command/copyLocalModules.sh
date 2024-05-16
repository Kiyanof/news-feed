#!/bin/bash

# List of microservices
microservices=("contentService" "newsFeedService" "notificationService" "subscriptionService" "userService")

# Path to the modules directory
modules_path="../modules"

# Copy the modules directory into each microservice directory
for service in "${microservices[@]}"; do
  cp -R "$modules_path" "../$service/"
done