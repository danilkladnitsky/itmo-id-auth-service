FROM node:16-alpine3.15 AS development

WORKDIR /usr/src/auth_service
COPY package.json ./
COPY package-lock.json ./
RUN npm i -f  --silent
COPY . .
RUN npm run build

FROM node:16-alpine3.15 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/auth_service
COPY package.json ./
COPY package-lock.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/auth_service/dist ./dist
EXPOSE 4000
CMD [ "node", "dist/main" ]