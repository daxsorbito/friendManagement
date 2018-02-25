FROM node:latest
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api
COPY package.json /usr/src/api/
RUN npm install
COPY . /usr/src/api
EXPOSE 8080
CMD ["npm", "start"]
