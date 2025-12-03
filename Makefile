install:
	npm ci

start:
	npx start-server -s ./frontend/dist

build:
	rm -rf frontend/dist
	cd frontend && npm ci && npm run build

develop:
	npm run build && npx @hexlet/chat-server