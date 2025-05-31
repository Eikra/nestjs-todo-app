.PHONY: start stop restart logs test migrate clean clean_db start-dev stop_db

# Use the docker-compose.yml inside nestjs-app/
DOCKER_COMPOSE = docker compose -f nestjs-app/docker-compose.yml

# Build and start all services (API, Postgres, Redis)
start:
	$(DOCKER_COMPOSE) up -d --remove-orphans

# Stop all running containers (including volumes)
stop_db:
	$(DOCKER_COMPOSE) down --volumes --remove-orphans

# Restart all services
restart: stop_db start

clean_db:
	docker stop $$(docker ps -q) || true
	docker rm $$(docker ps -aq) || true
	docker volume rm postgres_data postgres_data_test || true
	docker network rm backend || true

# Show real-time logs for all services
logs:
	$(DOCKER_COMPOSE) logs -f

# Run Prisma migrations
migrate:
	corepack enable && corepack prepare yarn@4.9.1 --activate
	cd nestjs-app && yarn install --immutable
	cd nestjs-app && yarn prisma generate
	cd nestjs-app && yarn prisma migrate deploy
	cd nestjs-app && yarn dotenv -e .env.test -- prisma migrate deploy

# Run tests outside the NestJS container
test: start
	cd nestjs-app && ./test.sh

# make sure to use localhost instead of postgres_db in .env +++++++++++++++++++++
# and localhost instead of redis_cache in .env.test
start-dev: start migrate
	docker stop nest_app || true
	docker rm nest_app || true
	cd nestjs-app && yarn start:dev

clean:
	cd nestjs-app && ./script.sh
