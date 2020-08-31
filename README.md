# Pith Client

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
