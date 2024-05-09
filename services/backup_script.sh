#!/bin/bash

mongodump --username mongoadmin --password secret mongodb://localhost:27017/Linux \
 --authenticationDatabase admin  --gzip \
-o "/root/database/backup/dump-$(date +'%Y-%m-%d-%H-%M-%S')" #&>/tmp/error.txt

