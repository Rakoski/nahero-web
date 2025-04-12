FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm install -D process

RUN npm run build

EXPOSE 4200

CMD ["sh", "-c", "API_URL=http://backend:8081/api/v1/ npx ng serve --host 0.0.0.0 --hmr"]