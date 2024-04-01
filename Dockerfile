FROM node:18

WORKDIR /app

COPY ./dist ./

RUN npm install -g serve

EXPOSE 8080

CMD [ "serve", "-s", "." , "-l", "8080" ]