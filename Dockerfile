FROM node:23.7.0

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --build-from-source
COPY . . 

EXPOSE 3000
RUN chown -R node /usr/src/app
USER node

CMD [ "npm", "start"]

