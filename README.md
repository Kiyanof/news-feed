# News Feed Personalization and Subscription System

## Introduction

The News Feed Personalization and Subscription System is a cutting-edge platform designed to deliver highly personalized news feeds to users based on their interests. Leveraging advanced AI technologies like Qdrant and OpenAI, the platform ensures that users receive relevant, engaging, and up-to-date content.

## Key Features

- **Personalized News Feeds**: Curates news articles based on user interests.
- **Subscription Management**: Users can subscribe to receive personalized news updates via email.
- **AI Integration**: Utilizes Qdrant and OpenAI for accurate and relevant content curation.
- **Multiple News Sources**: Integrates various sources for diverse news coverage.
- **Email Notifications**: Sends personalized newsletters based on user-selected frequency.

## Getting Started

### Prerequisites

- **Operating System**: Linux, macOS, or Windows (with WSL for Linux compatibility) - requires a bash shell to run the setup script.
- **Docker and Docker Compose**: For containerization and service management.
- **Node.js and npm**: For local dependency installation and build.
- **RabbitMQ**: For message brokering.
- **OpenAI API Key**: For integrating OpenAI's capabilities.
- **Email**: For nodemailer to handle email notifications.

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Kiyanof/news-feed.git
    cd news-feed
    ```

2. **Set Up Environment Variables**:
    Create a `.env` file in the `/src` directory next to the docker-compose file and populate it with the required environment variables (see the Environment Variables section below).

3. **Configuration**:
    Rename `docker-compose-oneenv.yml` to `docker-compose.yml` in the `/src` directory to ensure only one `.env` file is needed.

4. **Run**:
    ```bash
    cd ./news-feed/src/backend/command
    ./run.sh
    ```

    Wait until `run.sh` finishes, then the newsfeed multi-container Docker platform will be built and up.

    The application runs on: [http://localhost](http://localhost)

    **Note**: If you get an Nginx bad gateway error, restart just Nginx in the newsfeed multi-container to cache Next.js statics again.

5. **Set Up RabbitMQ**:
    After the multi-container app is up, navigate to RabbitMQ at [http://localhost:15672](http://localhost:15672) using the username `guest` and password `guest`. 

    Go to the **Admin** tab and in the **Virtual Hosts** section, add a new vhost named `notificationVhost` with the stream type. 

    If you change the credentials or use a different name for the vhost, you must also update the relevant environment variables.

## Environment Variables

Ensure the following environment variables are set in your `.env` file:

### General Configuration

- `NODE_ENV=development`
- `LOG_LEVEL=debug`
- `LOG_DIR=./logs`

### Authentication Tokens

- `ACCESS_TOKEN_SECRET="94ff6d0f434222dfbc53f8fc85d6aaa1e3e653f827660db41a3433ce7fe69795"`
- `ACCESS_TOKEN_EXPIRES_IN="1h"`
- `ACCESS_TOKEN_ALGORITHM="HS256"`
- `REFRESH_TOKEN_SECRET="1cc68b7e835fdb9188f2ec039ac38fa82d5cc6f948d31ecb1287f9f6e22cd9c0"`
- `REFRESH_TOKEN_EXPIRES_IN="7d"`
- `REFRESH_TOKEN_ALGORITHM="HS256"`

### MongoDB Configuration

- `MONGO_PROTOCOL=mongodb`
- `MONGO_HOST=mongo`
- `MONGO_PORT=27017`
- `MONGO_USERNAME=`
- `MONGO_PASSWORD=`

### Redis Configuration

- `REDIS_PROTOCOL=redis`
- `REDIS_HOST=redis`
- `REDIS_PORT=6379`

### Broker Configuration

- `BROKER_PROTOCOL=amqp`
- `BROKER_HOST=rabbitmq`
- `BROKER_PORT=5672`
- `BROKER_DEFAULT_VHOST="notificationVhost"`
- `BROKER_DEFAULT_USERNAME="guest"`
- `BROKER_DEFAULT_PASSWORD="guest"`

### CORS Configuration

- `CORS_ORIGIN=http://localhost:3000`

### Service-Specific Configuration

#### User Service

- `APP_PORT_USER=8000`
- `MONGO_NAME_USER=newsfeed`
- `REDIS_DB_USER=1`

#### Subscription Service

- `APP_PORT_SUBSCRIPTION=8004`
- `MONGO_NAME_SUBSCRIPTION=userdb`
- `REDIS_USERNAME_SUBSCRIPTION=guest`
- `REDIS_PASSWORD_SUBSCRIPTION=guest`
- `REDIS_DB_SUBSCRIPTION=2`
- `WHITELIST_PROTOCOL_SUBSCRIPTION=redis`
- `WHITELIST_HOST_SUBSCRIPTION=redis`
- `WHITELIST_PORT_SUBSCRIPTION=6379`
- `WHITELIST_USERNAME_SUBSCRIPTION=guest`
- `WHITELIST_PASSWORD_SUBSCRIPTION=guest`
- `WHITELIST_DB_SUBSCRIPTION=1`
- `PARSE_PROMPT_SUBSCRIPTION=0`

#### Notification Service

- `APP_PORT_NOTIFICATION=8003`
- `EMAIL_SERVICE_NOTIFICATION=gmail`
- `EMAIL_USERNAME_NOTIFICATION=""`
- `EMAIL_PASSWORD_NOTIFICATION=""`

#### Newsfeed Service

- `APP_PORT_NEWSFEED=8005`
- `MONGO_DB_NEWSFEED=newsFeedService`
- `MONGO_USERNAME_NEWSFEED=`
- `MONGO_PASSWORD_NEWSFEED=`
- `NEWS_EXPIRE_NEWSFEED=2592000`
- `NEWSDATA_API_KEY_NEWSFEED="pub_433503da424996c1637d79153613a966ae842"`
- `NEWSDATA_PATH_NEWSFEED="https://newsdata.io/api/1"`
- `NEWSDATA_ENDPOINT_NEWSFEED="news"`
- `NEWSDATA_MAX_NEWSFEED=50`
- `NEWSDATA_ACTIVE_NEWSFEED=1`
- `NEWSAPI_API_KEY_NEWSFEED="461c65e7852b4d3ebc1b43ea688858a5"`
- `NEWSAPI_PATH_NEWSFEED="https://newsapi.org/v2"`
- `NEWSAPI_ENDPOINT_NEWSFEED="top-headlines"`
- `NEWSAPI_MAX_NEWSFEED=50`
- `NEWSAPI_ACTIVE_NEWSFEED=1`
- `GNEWS_API_KEY_NEWSFEED="2d5260b305beb6d93a75cf0be78c95f9"`
- `GNEWS_PATH_NEWSFEED="https://gnews.io/api/v4"`
- `GNEWS_ENDPOINT_NEWSFEED="top-headlines"`
- `GNEWS_MAX_NEWSFEED=50`
- `GNEWS_ACTIVE_NEWSFEED=1`
- `QDRANT_PROTOCOL_NEWSFEED=http`
- `QDRANT_HOST_NEWSFEED=qdrant`
- `QDRANT_PORT_NEWSFEED=6333`
- `RESET_NEWS_NEWSFEED=1`

#### Content Service

- `APP_PORT_CONTENT=8002`

#### OpenAI Configuration

- `OPENAI_API_KEY="sk-proj-c1g3JENJXrQBSTC7yLPWT3BlbkFJG8HqIcPQRW9sB6FgussR"`

## Architecture

### High-Level Overview

- **Microservices**: Organized using Domain-Driven Design (DDD) principles.
- **Components**:
  - `newsfeed-service`: Manages news content.
  - `user-service`: Handles user authentication.
  - `subscription-service`: Manages subscriptions and schedules updates.
  - `notification-service`: Sends personalized emails.
  - `content-service`: Communicates with OpenAI to process user prompts.

### Technologies

- **Frontend**: React, TypeScript, MUI, Tailwind CSS, Redux.
- **Backend**: Node.js, Express.js.
- **Databases**: MongoDB, Qdrant, Redis.
- **Message Broker**: RabbitMQ.
- **Reverse Proxy**: Nginx.
- **AI and ML**: OpenAI API, Qdrant FastEmbed.
- **Email Service**: NodeMailer.
- **Containerization**: Docker, Docker Compose.

### Contributing

- **Fork the Repository**
- **Create a Feature Branch**
- **Commit Changes**
- **Push to the Branch**
- **Open a Pull Request**

### Code Style

- **JavaScript/TypeScript**: Follow the Airbnb style guide.
- **CSS**: Follow the BEM naming convention.

## API Reference

### Authentication and Authorization

This platform uses JWT (JSON Web Token) for authentication and Redis for maintaining a whitelist of valid tokens. This ensures secure access to the API endpoints and efficient management of user sessions.

### Endpoints

- **POST /auth/subscribe**: Subscribe a new user.
- **POST /auth/login**: Log in a user.
- **POST /auth/logout**: Log out a user.
- **PUT /auth/change**: Change subscription details.
- **POST /auth/whoisme**: Return authenticated user information.
- **POST /api/news**: Get a list of news articles related to user interests.
- **POST /api/news/count**: Get the count of news articles related to user interests.

## License

