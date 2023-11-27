.PHONY: all clean

all: docker-up

docker-up:
	docker-compose up --build

clean:
	docker-compose down
	docker rm -f $(docker ps -aq)
	docker rmi -f $(docker images -aq)
	docker network prune -f
	docker volume prune -f


