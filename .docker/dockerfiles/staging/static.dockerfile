# Set base image
FROM node:6.9.1

MAINTAINER Stone Chen (dev@shitulv.com)

# Install nodemon
RUN npm install -g nodemon

# Set environment variables
ENV PORT 8000

COPY ./dev/static.js /usr/app/static.js
COPY ./package.static.json /usr/app/package.json
WORKDIR /usr/app
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install

# Internal port
EXPOSE $PORT

# Run app using node/nodemon
ENTRYPOINT ["node"]
CMD ["/usr/app/static.js"]


# docker run -d --net=web-network -p 8080:80 --name uploads -v /uploads:/usr/share/nginx/html:rw nginx
# docker run -d --net=web-network -p 8000:8000 --name static -v /uploads:/usr/app/uploads:rw shitulv/static

