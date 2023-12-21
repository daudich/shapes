# Shapes App

This is simple NodeJS app which runs a REST API server. It is meant to be for running operations
on various geometric shapes. Presently, it only supports Rectangles, but it can be easily expanded
to add more operators and shapes to operate on.

## Features

The app runs a REST API server with the Rectangle service. Here are the methods that it currently supports:

### Rectangle Intersection
Calculate if two rectangles intersect one another.

> POST http://localhost:3000/api/v1/rectangle/intersect

You must _request_ it with a JSON body in the following format:

```json
{
  "r1": {
    "x": 0,
    "y": 0,
    "width": 5,
    "height": 5
  },
  "r2": {
    "x": -3,
    "y": 5.1,
    "width": 5,
    "height": 5
  }
}
```

The server responds with the following possible responses:

|HTTP Response Code |Respose |
--- | ---
200 | With a JSON body that contains the coordinates of a rectangle which covers the area of the intersection.
400 | For bad request. For example, missing parameters or wrong format. Body with the error message.
402 | No body if the rectangles don't intersect.

```json
{
  "left": {
    "upper": {
      "x": 0,
      "y": 1
    },
    "lower": {
      "x": 0,
      "y": 0
    }
  },
  "right": {
    "upper": {
      "x": 1,
      "y": 1
    },
    "lower": {
      "x": 1,
      "y": 0
    }
  }
}
```

### Rectangle Containment
Calculate if rectangle 2 (r2) is contained inside rectangle 1 (r1).

> POST http://localhost:3000/api/v1/rectangle/contain

Same _request_ JSON object as intersect.

The server responds with the following possible responses:

|HTTP Response Code |Respose |
--- | ---
200 | With a JSON body that contains the boolean value if the r2 is contained in r1.
400 | For bad request. For example, missing parameters or wrong format. Body with the error message.

### Rectangle Adjacency
Calculate if rectangle 2 (r2) is adjacent to rectangle 1 (r1).

> POST http://localhost:3000/api/v1/rectangle/are-adjacent

Same _request_ JSON object as intersect.

The server responds with the following possible responses:

|HTTP Response Code |Respose |
--- | ---
200 | With a JSON body that contains the adjacency type that tells you if the rectangles are adjacent and how.
400 | For bad request. For example, missing parameters or wrong format. Body with the error message.

## Future Improvements
The following things can be done to further improve the quality of the software:

- Use [swagger](https://www.npmjs.com/package/swagger2-koa) to document the REST API.
- Use [class-validator](https://www.npmjs.com/package/class-validator) package for class validation.
- Setup CI/CD pipeline with a vendor.

## Getting Started

To be clear, this isn't a production build, so it isn't security hardened. It is meant for demostration purposes only.

### Prerequisites

To run the app, you must have the following prerequisites:

- [NodeJS](https://nodejs.org/en/) version 21.5.0
- [NPM](https://www.npmjs.com/get-npm)
- [Docker compose](https://docs.docker.com/compose/install/)

### Installing

To download all of the dependencies and compile the code:

```bash
npm run build
```

To download and build the Docker image only:

```bash
docker compose build
```

### Testing

To run Mocha tests and also see the NYC code coverage run:

```bash
npm run test
```

These tests include both unit tests as well as API integration tests.

### Linting

The code was written with Airbnb's Typescript coding styles. ESLint has been setup to enforce coding style. To run lint:

```bash
npm run lint
```

To automatically fix issues:

```bash
npm run lint:fix
```

## Running

To run the program via Docker containers:

```bash
docker compose run -d
```

## Authors
[Dhiren Audich](mailto:dhiren@audich.net)