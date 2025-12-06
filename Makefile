# Установка зависимостей для сервера и фронтенда
install:
	npm install
	cd frontend && npm install

# Сборка фронтенд-приложения
build:
	cd frontend && npm install
	rm -rf frontend/dist
	cd frontend && npm run build

# Запуск бэкенд-сервера
start:
	npx start-server -s ./frontend/dist

# Запуск фронтенда в режиме разработки
start-frontend:
	cd frontend && npm run dev

# Запуск бэкенда и фронтенда параллельно
start-all:
	make start & make start-frontend

lint:
	cd frontend && npm run lint

fix:
	cd frontend && npm run lint:fix