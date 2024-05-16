for script in ./*.sh; do
  if [ "$(basename "$script")" != "run.sh" ]; then
    bash "$script"
  fi
done