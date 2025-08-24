docker-build:
	docker build -t jsoncrack:$(tag) .
docker-run:
	docker run --name jsoncrack -p 8888:8080 -d -e NODE_ENV=production jsoncrack:$(tag)
docker-kill:
	docker stop jsoncrack && docker rm jsoncrack
docker-compose-dev:
	docker compose -f ./docker-compose.yml up --build -V --remove-orphans -d
docker-compose-prod:
	docker compose -f ./docker-compose.yml up -d
prod-build:
	pnpm install && pnpm run build