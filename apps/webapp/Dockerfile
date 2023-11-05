FROM node:20-slim
RUN mkdir -p ./dist/qubetime
COPY  dist/qubetime/ dist/qubetime
EXPOSE 4000
CMD ["node", "./dist/qubetime/server/main.js"]
