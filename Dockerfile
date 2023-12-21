FROM node:21-alpine

WORKDIR /srv

ADD ./dist ./dist

ADD ./package.json  ./package.json

RUN npm install --production --silent

EXPOSE 3000

CMD [ "npm", "start" ]