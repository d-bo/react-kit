FROM node:12.2.0-alpine as build-deps

# set working directory
WORKDIR /

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY tsconfig.json /tsconfig.json
COPY package.json /package.json
COPY package-lock.json /package-lock.json
COPY yarn.lock /yarn.lock
COPY src /src
COPY public /public
RUN npm install
RUN npm install -g react-scripts@3.0.1
RUN npm install firebase --force
RUN npm run-script build

# start app
#CMD ["npm", "start"]

FROM nginx:1.12-alpine as front-end-react
COPY --from=build-deps /build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
