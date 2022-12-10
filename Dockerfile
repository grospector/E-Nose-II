FROM node:18.12.1 AS builder
WORKDIR /E-Nose-II

COPY package.json package-lock.json ./
RUN npm install

ENV PATH="./node_modules/.bin:$PATH"
COPY . ./
RUN ng build --configuration="production"

FROM nginx:1.22.1
COPY --from=builder /E-Nose-II/dist/e-nose-ii /usr/share/nginx/html