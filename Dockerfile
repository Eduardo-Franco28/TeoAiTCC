FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_INTEGRAMENTE_API_URL
ARG VITE_TEO_API_URL

RUN test -n "$VITE_INTEGRAMENTE_API_URL" || (echo "Informe o build arg VITE_INTEGRAMENTE_API_URL" && exit 1)
RUN test -n "$VITE_TEO_API_URL" || (echo "Informe o build arg VITE_TEO_API_URL" && exit 1)

ENV VITE_INTEGRAMENTE_API_URL=$VITE_INTEGRAMENTE_API_URL \
    VITE_TEO_API_URL=$VITE_TEO_API_URL

RUN npm run build


FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
