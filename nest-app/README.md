## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ nvm install           # Install Node.js version specified in .nvmrc
$ nvm use               # Switch to the installed Node.js version
$ yarn install          # Install all project dependencies
```

## Running the app

```bash
# development
$ yarn run start         # Start the application in development mode

# watch mode
$ yarn run start:dev     # Start the application in development mode with file watching enabled

# production mode
$ yarn run start:prod    # Start the application in production mode
```

## Test

```bash
# unit tests
$ yarn run test          # Run all unit tests to verify code functionality

# e2e tests
$ yarn run test:e2e      # Run end-to-end tests to ensure the entire system works as expected

# test coverage
$ yarn run test:cov      # Generate a test coverage report
```

## Command

```bash
# development
$ yarn console:dev [command]      # Run custom commands in a development environment

# production
$ yarn console [command]          # Run custom commands in a production environment

```


## Migration

```bash

$ yarn migration:run           # Execute all pending database migrations
$ yarn migration:generate      # Generate a new migration based on database changes
$ yarn migration:create        # Create a blank migration file to define custom changes
$ yarn migration:revert        # Revert the last executed migration
$ yarn migration:show          # Show all executed and pending migrations


```
