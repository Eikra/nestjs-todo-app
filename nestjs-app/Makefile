.PHONY: start stop restart logs test migrate

# Build and start all services (API, Postgres, Redis)
start_db:
	docker compose up --build -d --remove-orphans

# Stop all running containers
stop_db:
	docker compose down --volumes --remove-orphans

# Restart all services
restart_db: stop start

clean_db:
	docker stop $(docker ps -q)   
	docker rm $(docker ps -aq)     
	docker volume rm postgres_data postgres_data_test 
	docker network rm backend

# Show real-time logs for all services
logs:
	docker compose logs -f

# Run Prisma migrations 
migrate:
	yarn prisma generate
	yarn prisma migrate deploy
	yarn dotenv -e .env.test -- prisma migrate deploy

# Run tests inside the NestJS container
test:
	yarn test:e2e

start-dev:
	yarn start:dev

start-app:
	yarn start:prod

start:
	corepack enable && corepack prepare yarn@4.9.1 --activate
	yarn install --immutable

all: start_db start 


