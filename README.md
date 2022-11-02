# NFT Framework

Welcome to Framework monorepo.

## Pre Install

I assume you have NodeJS NPM/YARN, Postgres, RabbitMQ and Redis installed
or, you can just use docker and docker compose :)

In any case you have to fill up sensitive keys in docker files or .env files

## DEV setup with Docker-compose and Besu blockchain
0. Stop all containers (if any) and clean existing postgres and besu
```shell script
docker stop $(docker ps -a -q)
docker compose down -v
rm -rf postgres
rm -rf besu
```
1. Run prepare script
```shell script
npm run prepare:framework:dev
```
2. Run framework services one-by-one in separate terminals for easy monitoring

Admin-api (it will run initpostgres migrations)
```shell script
npm run --prefix ./services/admin-api start
```
Admin-ui
```shell script
npm run --prefix ./services/admin-ui start
```
Market-api
```shell script
npm run --prefix ./services/market-api start
```
Market-ui
```shell script
npm run --prefix ./services/market-ui start
```
Core-eth
```shell script
npm run --prefix ./services/core-eth start
```

## API docs

There is Swagger API documentation configured on http://localhost:3001/swagger

## Configuration

For fine tune check services READMEs

***
In case you have installed postgres db, you must create `gemunion-development` database manually,
script only creates schema for you.

In order to run tests, you must create `gemunion-test` database manually too.
