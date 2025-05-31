#!/bin/bash
# Stop and remove all containers
docker stop $(docker ps -q)    # Stop all running containers
docker rm $(docker ps -aq)     # Remove all containers, including stopped ones
# Remove stopped containers
docker container prune -f
# Remove unused images (both dangling and tagged)
# docker image prune -af
# Remove builder cache
# docker builder prune -f
# Remove unused volumes
docker volume prune -f
docker rmi nestjs-app-nest-app
docker volume ls -q | xargs -r docker volume rm
# Remove unused networks
docker network prune -f
docker network ls -q | xargs -r docker network rm
