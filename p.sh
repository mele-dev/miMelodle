#!/usr/bin/env bash

docker rm -vf "$(docker ps -aq)"
docker system prune --all --force
docker image prune --all --force
docker volume prune --all --force
