# Entain sudoku app

- This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.
- The tests are generated using Jasmine and Karma
- FE and BE parts
  -- FE: Supports single player and partially implemented multiplayer
  -- BE: Nodejs with Socket IO for creating multiplayer server for realtime user interaction and observation

## Development server

To start a local development server, run:

```bash
npm run start
```

## Building

To build the project run:

```bash
npm run build
```

## Testing

To test the project run:

```bash
npm run test
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Project information

- Can create single player games, resolve and validate the games
- !!!! The provided service has NO VALIDATION for the running game. It is just a dummy service that always returns random data so it can NOT REALLY resolve played games. Instead it just returns new RANDOM already solved game which breaks the played board and not create real time validation. Like marking if the number was right or wrong and implement "remaining tries" feature

## Tech stack

- Angular v20
- Nodejs v22
- Socket.io for socket connection used for the multiplayer game
- SCSS, Tailwind, Angular Material
