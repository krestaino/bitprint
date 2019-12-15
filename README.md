# Bitwarden Print

**Bitwarden Print** aims to provide a convenient format to print your
Bitwarden backups. Everything is handled in the browser, your data does not go anywhere.
That said, I would not trust this without reviewing the source.

**It's highly recommended to clone the repo and run it yourself.**

## Demo

- https://bitwarden-print.kmr.io/?demo
- https://bitwarden-print.kmr.io/demo.pdf

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
- Prettier with Husky enabled on pre-commits

**Setup Project**

- Installs dependencies for the **Client**.
- Creates an .env file with defaults if one doesn't exist.

```
$ yarn setup
```

**Start development server**

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

**Build Client**

```
$ yarn build
```

**Serve Client**

```
$ yarn serve
```
