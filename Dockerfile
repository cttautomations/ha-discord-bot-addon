FROM node:18-alpine

WORKDIR /app

COPY run.sh /run.sh
COPY . /app

RUN chmod +x /run.sh && npm install

CMD ["/run.sh"]
