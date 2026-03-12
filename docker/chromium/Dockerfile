FROM mcr.microsoft.com/playwright:v1.50.0-noble

WORKDIR /app

RUN npm init -y && npm install playwright@1.50.0

COPY server.js .

EXPOSE 9222
CMD ["node", "server.js"]
