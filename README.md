# Sword Tasks API (Senior Backend Engineer Challenge)

<img src="./sword.jpg />

## Table of Contents
- [Requirements](#requirements)
- [Features](#features)
- [Tech Requirements](#tech-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)

## Requirements
You are developing software to account for maintenance tasks performed during a working day. This application has two types of users: Manager and Technician.

- **Technician**: Performs tasks and can only see, create, or update their own tasks.
- **Manager**: Can see tasks from all technicians, delete them, and should be notified when a technician performs a task.

A task has a summary (max: 2500 characters) and a date when it was performed. The summary can contain personal information.

### Notes
- If you don’t have enough time to complete the test, prioritize complete features (with tests) over many features.
- We’ll evaluate security, quality, and readability of your code.
- This test is suitable for all levels of developers, so make sure to prove yours.

## Features
- **Create API endpoint to save a new task**
- **Create API endpoint to list tasks**
- **Notify manager of each task performed by the technician**
  - This notification can be a print statement saying “The tech X performed the task Y on date Z”
  - This notification should not block any HTTP request.

## Tech Requirements
- Use either Go or Node to develop this HTTP API.
- Create a local development environment using Docker containing this service and a MySQL database.
- Use MySQL database to persist data from the application.
- Features should have unit tests to ensure they are working properly.

### Bonus
- Use a message broker to decouple notification logic from the application flow.
- Create Kubernetes object files needed to deploy this application.

## Installation
1. Clone the repository
```bash
git clone https://github.com/RazielRodrigues/sword-health-project.git
```
2. Change to the project directory
```bash
cd sword-health-project
```
3. Run the docker-compose
```bash
docker-compose up
```

## Usage
...

## Testing
...

## Tech stack
...

## System design
...

## Further improvements
...
