FROM  588738580829.dkr.ecr.ap-southeast-2.amazonaws.com/node:20.15.0-alpine AS frontend_builder

WORKDIR /frontend

COPY package*.json ./
COPY . .
RUN npm install --force


RUN npm run build

FROM 588738580829.dkr.ecr.ap-southeast-2.amazonaws.com/nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY --from=frontend_builder /frontend/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# FROM  node:20.15.0-alpine AS frontend_builder

# WORKDIR /frontend

# COPY package*.json ./
# COPY . .
# RUN npm install --force


# RUN npm run build

# FROM nginx:stable-alpine
# WORKDIR /usr/share/nginx/html
# COPY --from=frontend_builder /frontend/dist .
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
