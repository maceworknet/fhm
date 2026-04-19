FROM webdevops/php-nginx:8.3

WORKDIR /app

COPY . /app

RUN composer install --no-dev --optimize-autoloader

RUN chown -R application:application /app \
    && chmod -R 775 /app/storage /app/bootstrap/cache || true

ENV WEB_DOCUMENT_ROOT=/app/public

EXPOSE 80