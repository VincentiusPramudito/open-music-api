## Installation

Use the npm to install open-music-api.

```bash
npm install
```

### .env

Create .env file and write values like belows:

```bash
#server-node configuration
PORT=
HOST=

#server-postgre configuration
PGUSER=
PGHOST=
PGPASSWORD=
PGDATABASE=
PGPORT=
```

### ESLint

Use the npm to check style code using eslint.

```bash
npm run lint
```

## Migration

When you want to create table with postgres, you can use this command line and you will create two tables (albums & songs).
I will assume you already setup your postgres (user, role, database, etc)

```bash
npm run migrate up
```

If you want to delete the table using this command line

```bash
npm run migrate down
```

## Running program

After install all package you can run the program with this command line and your program will be running on development.

```bash
npm run start
```
or if you want to running it on production you can run this command line.
```bash
npm run start:prod
```

## Running script for testing

When running this program, you can check all routes function using newman. Dont forget to install newman first.
You can install it globally.
```bash
npm install newman --g
```

After that, start again this program and then run this command line (open another terminal on the same folder).
```bash
newman run Test.postman_collection.json --environment Test.postman_environment.json 
```
