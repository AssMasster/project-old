# Установка зависимостей для сервера и фронтенда
install:
	npm ci
	cd frontend && npm ci

# Сборка фронтенд-приложения
build:
	cd frontend && npm run build

# Запуск бэкенд-сервера
start:
	npx start-server -s ./frontend/dist

# Запуск фронтенда в режиме разработки
start-frontend:
	npm run dev --prefix frontend

# Запуск бэкенда и фронтенда параллельно
start-all:
	make start & make start-frontend

lint:
	cd frontend && npm run lint

fix:
	npm run lint:fix --prefix frontend
	