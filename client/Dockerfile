FROM node:19-alpine3.15
RUN apk add g++ make py3-pip

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]