mkdir -p ../docker

for file in $(find .. -name .env -not -path "../env/*"); do
  foldername=$(basename $(dirname "$file"))
  ln -s "$file" "../env/${foldername}.env"
done