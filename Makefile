# Установка зависимостей для сервера и фронтенда
install:
	npm install
	npm install --prefix frontend

# Сборка фронтенд-приложения
build:
	rm -rf frontend/dist
	npm run build --prefix frontend

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
	npm run lint --prefix frontend

fix:
	npm run lint:fix --prefix frontend