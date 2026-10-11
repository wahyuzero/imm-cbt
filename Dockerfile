FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

RUN rm -f /usr/share/nginx/html/test_*.js \
    && rm -f /usr/share/nginx/html/*.txt \
    && rm -f /usr/share/nginx/html/*.md \
    && rm -f /usr/share/nginx/html/Dockerfile* \
    && rm -f /usr/share/nginx/html/nginx.conf \
    && rm -f /usr/share/nginx/html/.dockerignore \
    && rm -f /usr/share/nginx/html/.gitignore

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
