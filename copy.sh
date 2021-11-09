#!/bin/bash

rsync -ar --exclude=*.ts ./src/* ./out/ 
mv out/server/* server/
rmdir out/server

# mv out/src/* out/
# rmdir out/src