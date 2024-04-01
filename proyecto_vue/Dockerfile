FROM node:18

WORKDIR /app

COPY ./dist ./

RUN npm install -g serve

EXPOSE 8081

CMD [ "serve", "-s", "." , "-l", "8081" ]