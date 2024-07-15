#!/bin/bash
cd "$(dirname "$0")"
while :
do
    git pull
    sleep 1
done

