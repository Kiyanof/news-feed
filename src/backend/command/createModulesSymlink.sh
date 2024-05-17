#!/bin/bash

mkdir -p ../../modules

# Iterate over each directory in ../modules/*
for dir in ../modules/*; do
  # Check if it's a directory
  if [ -d "$dir" ]; then
    # Get the base name of the directory
    foldername=$(basename "$dir")
    # Copy the directory to the target location
    cp -r "$dir" "../../modules/$foldername"
  fi
done