FROM webdevops/php-nginx:8.3

WORKDIR /app

# Node kurulumu
RUN apt-get update && apt-get install -y nodejs npm

# Projeyi kopyala
COPY . /app

# Composer install
RUN composer install --no-dev --optimize-autoloader

# Frontend build
RUN npm install && npm run build

# Permissions
RUN mkdir -p /app/storage /app/bootstrap/cache \
    && chown -R application:application /app \
    && chmod -R 775 /app/storage /app/bootstrap/cache

ENV WEB_DOCUMENT_ROOT=/app/public

EXPOSE 80