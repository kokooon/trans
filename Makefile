.PHONY: all clean

all: docker-up

docker-up:
	docker-compose up --build

clean:
	docker-compose down
