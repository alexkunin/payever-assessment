FROM node:20.9

WORKDIR /app
ADD package*.json .
RUN npm ci

ADD . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main"]
