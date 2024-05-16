mkdir -p ../docker

for file in $(find .. -name Dockerfile -not -path "../docker/*"); do
  foldername=$(basename $(dirname "$file"))
  ln -s "$file" "../docker/${foldername}.Dockerfile"
done