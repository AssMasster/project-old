build:
	cd frontend && npm install && npm run build

start:
	npx @hexlet/chat-server -p 5001 & npx serve -s ./frontend/dist -l $PORT