FROM node:20-slim
RUN mkdir -p ./dist/apps/webapp
COPY  dist/apps/webapp/ dist/apps/webapp
EXPOSE 4000
CMD ["node", "./dist/webapp/server/main.js"]
