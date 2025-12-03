.PHONY: install build start test

install:
	npm ci
	cd frontend && npm ci

build:
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist

test:
	npx start-server -s ./frontend/dist &
	sleep 10
	npx playwright test