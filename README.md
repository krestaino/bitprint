# Bitwarden Print

## Requirements

- Node 10.x
- Yarn 1.x

## Quick Start

```
$ yarn setup
$ yarn start
```

Navigate to http://localhost:3000.

## Development

**Features**

- React 16, Express 4, and Tailwind CSS
- Single commands to start, build, and serve the client and server
- Shared environment variables
- Babel to write ES6 everywhere
- Prettier with Husky enabled on pre-commits
- Hot reloading for the client and server

**Setup Project**

- Installs dependencies for the **Server** and **Client**.
- Creates an .env file with defaults if one doesn't exist.

```
$ yarn setup
```

**Start development servers**

- **Server:** http://localhost:5000
- **Client:** http://localhost:3000

```
$ yarn start
```

## Environment Variables

Located in the [.env](.env) file. Follow [.env.example](.env.example) as an example.

## Production

**Setup Project**

```
$ yarn setup
```

**Build Server and Client**

```
$ yarn build
```

**Serve Server and Client**

```
$ yarn serve
```
