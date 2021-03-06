# Set base image
FROM node:6.9.2

# File author / maintainer
MAINTAINER Stone Chen (dev@shitulv.com)

# Install nodemon
RUN npm install -g nodemon

# Set environment variables
ENV PORT 3000

#COPY ./dev/static/root.js /usr/app/root.js
COPY ./docker/config/static.package.json /usr/app/package.json
WORKDIR /usr/app
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install

# Internal port
EXPOSE $PORT

# Run app using node/nodemon
ENTRYPOINT ["node"]
CMD ["root.js"]
