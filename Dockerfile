FROM node:14
WORKDIR /urs/src/app
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
