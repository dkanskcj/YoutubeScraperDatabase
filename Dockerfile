FROM node:16-alpine
EXPOSE 80
WORKDIR /usr/src/organization-server
COPY . .
RUN npm install
RUN npm run build
CMD npm run start:prod
