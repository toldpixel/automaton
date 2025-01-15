# README

## Automaton

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
3. [Usage](#usage)
4. [Features](#features)

---

## About the Project

Automaton is a scalable and fully automated system that can scrape multiple websites either once or repeatedly according to specified schedules.
![image](https://github.com/user-attachments/assets/30b03c25-1b86-4f4a-b2b3-8a60ca6e55d9)

- **Technologies Used**  
  Below is a list of programming languages, frameworks, and libraries used.

  - **Backend**

    - Socket.io
    - Bullmq
    - PostgreSQL
    - MongoDB
    - Playwright
    - Docker
    - Redis
    - Prisma
    - OpenAI

  - **Frontend**
    - NextJS 19
    - Tailwind
    - Rechart
    - Shadcn/ui

- **Features**
  - You can add a website and set the scraping priority (High, Medium, Low, None). The scraping frequency can be defined in the frontend with a dropdown menu, which corresponds to predefined Cron jobs.
  - The results are immediately available after scraping and are plotted in a bar chart. Price information and labels are also displayed.
  - The system has an AI Mode and a Test Mode. Switching to AI Mode enables scraping with ChatGPT, while Test Mode generates sample data.
  - If recurring scrapes are set, scraping can be performed concurrently; i.e., multiple websites can be added and scraped at the selected intervals.
  - The overview provides a simple status indicator showing when the last scrape took place. Each status is displayed in different colors and updates in real time if there is a change.
  - Scrape tasks can be selected and freely deleted as desired.

## Installation

### Prerequisites

List any prerequisites needed to run your project:

The Backend runs in multiple Docker containers. You need Docker to setup the environment.

- Docker for creating the containers [Docker](https://www.docker.com/)
- Docker Compose running the multiple containers [Docker Compose](https://docs.docker.com/compose/)
- ChatGPT Assistant for AI mode (you'll need access to Openai API and create an Assistant with
  custom Prompts), otherwise the application will only run in Demo Mode with the AI switch turned off (by default).

The Backend application containers expose the ports http://localhost:4000 (Scraper), http://localhost:4444 (Scheduler), http://localhost:5000 (Management), http://localhost:27017 (MongoDB), http://localhost:5432 (PostgrSQL), http://localhost:6379 (Redis)

You need to add 2 .env files for each service. Docker compose uses the .env.\*\*\* environment variables file to read the variables.

- Scraper:
  **Create a .env File**
  PORT=""
  REDIS_HOST="127.0.0.1"
  OPENAI_API_KEY=""
  OPENAI_ASSISTANT_ID=""
  OPENAI_THREAD_ID=""
  MONGO_DB="127.0.0.1"
  MONGODB_DB=""
  MONGODB_USER=""
  MONGODB_PASS=""
  MANAGEMENT_HOST="127.0.0.1"
  SCHEDULER_API_URL="http://localhost:4444"

  **Create a .env.scraper File**
  PORT=4000
  REDIS_HOST="redis"
  OPENAI_ASSISTANT_ID=""
  SCHEDULER_API_URL="http://scheduler:4444"
  MONGO_DB="mongodb"
  MONGODB_DB=""
  MONGODB_USER=""
  MONGODB_PASS=""
  MANAGEMENT_HOST="management"

- Scheduler:
  **Create a .env File**
  PORT=4444
  REDIS_HOST="127.0.0.1"

  **Create a .env.scheduler File**
  PORT=4444
  REDIS_HOST="redis"

- Management:
  **Create a .env File**
  DATABASE_URL=""
  PORT=5000
  SCHEDULER_API_URL="http://localhost:4444"
  MONGO_DB="127.0.0.1"
  MONGODB_DB=""
  MONGODB_USER=""
  MONGODB_PASS=""

  **Create a .env.managment File**
  DATABASE_URL=""
  PORT=5000
  SCHEDULER_API_URL="http://scheduler:4444"
  MONGO_DB="mongodb"
  MONGODB_DB="cloudgpu"
  MONGODB_USER=""
  MONGODB_PASS=""

The Frontend

- The Frontend application doesnt run in a container. You have to
  install the dependencies manually. See under Steps

The Frontend application exposes the port http://localhost:3000 (frontend)

### Steps

Provide step-by-step instructions to install your project:

```bash
# Clone the repository
git clone https://github.com/toldpixel/automaton.git

# Navigate to the project directory
cd automaton

# docker-compose.yml file defines the services, networks, and volumes required for your application.
docker compose build

# Start the backend services with
docker compose up

# switch to the frontend folder
cd frontend

# Install the frontend dependencies
npm install  # or your package manager

# Start the frontend
npm run dev
```

After a view seconds you should see the "Scraper ready" signal on green. That means that a connection between your frontend and the scraper service got established your scraper is connected to
redis and the scheduler aswell and depend on those services running.
