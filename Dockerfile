FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3400

CMD ["npm", "run", "production"]