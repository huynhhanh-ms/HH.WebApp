FROM node:20.18-alpine3.19 as build

WORKDIR /app
COPY . /app

ARG VITE_OPENAI_KEY
RUN yarn install
RUN VITE_OPENAI_KEY=$VITE_OPENAI_KEY yarn build


FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html/
# COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 3039
CMD ["nginx","-g","daemon off;"]

