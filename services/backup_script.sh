#!/bin/bash

backup_folder="/root/database/backup"
backup_file="$backup_folder/$(date +'%Y-%m-%d-%H-%M-%S').sql.gz"
#-U user db
pg_dump -U mongoadmin Linux  | gzip > "$backup_file"
