FROM node:16-alpine

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 3000