.PHONY: start stop restart logs test migrate

# Build and start all services (API, Postgres, Redis)
start:
	docker compose up -d --remove-orphans

# Stop all running containers
stop_db:
	docker compose down --volumes --remove-orphans

# Restart all services
restart: stop start

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
	corepack enable && corepack prepare yarn@4.9.1 --activate
	yarn install --immutable
	yarn prisma generate
	yarn prisma migrate deploy
	yarn dotenv -e .env.test -- prisma migrate deploy

# Run tests outside the NestJS container
test: start
	./test.sh

# make sure to use localhost instead of postgres_db in .env +++++++++++++++++++++
# and localhost untested of redis_cache in .env.test
start-dev: start migrate
	docker stop nest_app || true
	docker rm nest_app || true
	yarn start:dev

clean:
	./script.sh






