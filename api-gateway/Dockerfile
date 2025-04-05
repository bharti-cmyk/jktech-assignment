FROM node:20-alpine

WORKDIR /usr/src/app

# Install required build dependencies
RUN apk add --no-cache python3 py3-pip make g++ 

COPY package*.json ./

# Install dependencies, forcing bcrypt to be rebuilt
RUN npm ci --omit=dev && npm rebuild bcrypt --build-from-source

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm", "run", "start"]
