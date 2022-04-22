FROM node:15.14.0-alpine

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install --force

ADD . /app/

COPY . .

RUN npm run build

EXPOSE 3000

# For production
CMD ["npm","run","start"]

# For development
# CMD ["npm","run","dev"]