FROM node:20-slim

RUN npx playwright install-deps chromium

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 6000
CMD ["node", "dist/index.js"]
