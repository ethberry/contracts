FROM node:16-alpine AS base
ENV NODE_OPTIONS=--max-old-space-size=6144
LABEL stage=build

RUN apk add \
  python3 \
  build-base \
  git \
  bash \
  curl \
  gettext \
  nano \
  && npm i -g node-gyp

FROM base AS deps
LABEL stage=deps

USER node
ENV NODE_OPTIONS=--max_old_space_size=4096

RUN mkdir -p /home/node/contracts
WORKDIR /home/node/contracts

COPY --chown=node:node package.json .
COPY --chown=node:node .npmrc .

RUN npm i --only=production
COPY --chown=node:node . .
RUN npm run build

FROM deps AS prod
LABEL stage=prod

USER node
ENV NODE_OPTIONS=--max_old_space_size=4096

WORKDIR /home/node/contracts

COPY --from=deps --chown=node:node . .

ENV PATH="/home/node/contracts/node_modules/.bin:${PATH}"

#RUN npm