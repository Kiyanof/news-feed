for script in ./*.sh; do
  if [ "$(basename "$script")" != "run.sh" ]; then
    bash "$script"
  fi
done

cd ./../.. # Change the current working directory to the src/ directory
pwd # Print the current working directory

max_attempts=5
attempt=0

until [ $attempt -ge $max_attempts ]
do
  docker-compose -p newsfeed -f docker-compose.yml up --build && break
  attempt=$[$attempt+1]
  echo "docker-compose failed, retrying ($attempt/$max_attempts)..."
  sleep 5
done

if [ $attempt -eq $max_attempts ]; then
  echo "Failed to start docker-compose after $max_attempts attempts, exiting"
  exit 1
fi