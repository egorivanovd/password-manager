# Password Manager

Небольшой менеджер паролей (и заметок) на React, Node.js и Express.

## Настройка окружения

Для корректной работы проекта необходимо создать несколько `.env` файлов с настройками окружения. Ниже приведены инструкции по их созданию и заполнению.

### 1. `client/.env`

Создайте файл `.env` в директории `client` и добавьте следующие переменные окружения:

```ini
REACT_APP_API_URL=http://localhost:5000
```

### 2. `server/.env`

Создайте файл `.env` в директории `server` и добавьте следующие переменные окружения:

```ini
DB_HOST=localhost
DB_PORT=5432
DB_NAME=example_db
DB_USER=user
DB_PASSWORD=secret
SECRET_KEY=your_secret_key
```

## Установка зависимостей и запуск

### 1. Клиентская часть
```bash
cd client
npm i
npm start
cd ..
```

### 2. Серверная часть
```bash
cd server
npm i
npm start
cd ..
```
