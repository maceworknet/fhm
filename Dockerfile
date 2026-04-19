FROM webdevops/php-nginx:8.3

WORKDIR /app

# Node 20 kur
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Proje kopyala
COPY . /app

# PHP bağımlılıkları
RUN composer install --no-dev --optimize-autoloader

# Frontend build
RUN npm install && npm run build

# Permissions
RUN mkdir -p /app/storage /app/bootstrap/cache \
    && chown -R application:application /app \
    && chmod -R 775 /app/storage /app/bootstrap/cache

ENV WEB_DOCUMENT_ROOT=/app/public

EXPOSE 80