run:
	docker run -it --name ${name} playwright:v0.1.1
clear:
	docker system prune
up:
	docker-compose up