install:
	npm ci

start:
	npx start-server -s ./frontend/dist

build:
	cd frontend && npm ci && npm run build

develop:
	npm run build && npx @hexlet/chat-server