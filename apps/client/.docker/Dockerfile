FROM node:16-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN npm i && npm run build

FROM nginx:1.21.0-alpine as production
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]