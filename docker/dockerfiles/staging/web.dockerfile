# Set nginx base image
FROM nginx:latest

# File author / maintainer
MAINTAINER Stone Chen (dev@shitulv.com)

# Copy custom configuration file from the current directory
#COPY ./docker/config/staging/web.conf /etc/nginx/nginx.conf
COPY ./assets/WeChat/MP_verify_jZ1CbXiQ4sDutXiR.txt /usr/share/nginx/html/MP_verify_jZ1CbXiQ4sDutXiR.txt
COPY ./dev/web /usr/share/nginx/html