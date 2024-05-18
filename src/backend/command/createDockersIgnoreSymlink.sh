mkdir -p ../docker

for file in $(find .. -name .dockerignore -not -path "../docker/*"); do
  foldername=$(basename $(dirname "$file"))
  ln -s "$file" "../docker/${foldername}.dockerignore"
done