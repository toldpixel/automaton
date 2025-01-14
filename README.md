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
