# Pith Client

**This repository is archived as of 9/18/20 as the codebase was merged into the [Pith project's repo](https://github.com/rainflame/pith). Future development on the Pith client will take place in that repository.**

The web interface portion of Pith. Implemented in javascript using React and socket.io.

## Development

Download the code for the [Pith API](https://github.com/rainflame/pith-api) and install it first.

Install the dependencies:

```
npm install
```

Create a `.env` file. Set an environent variable called `REACT_APP_API` that points to the running backend. For instance:

```
REACT_APP_API=https://localhost:8000
```

Run the development server:

```
npm run start
```
