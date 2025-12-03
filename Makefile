install:
	npm ci

start:
	npx start-server -s ./frontend/dist

build:
	rm -rf frontend/dist
	cd frontend && npm ci && npm run build

develop:
	npm run build && npx @hexlet/chat-server

test:
	# Собираем
	cd frontend && npm run build
	
	# Запускаем сервер
	npx start-server -s ./frontend/dist -p 5000 &
	SERVER_PID=$$!
	
	# Ждем
	sleep 15
	
	# Запускаем тесты
	npx playwright test --timeout=60000
	
	# Останавливаем сервер
	kill $$SERVER_PID 2>/dev/null || true