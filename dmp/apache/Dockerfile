FROM php:7.4-apache

# Set working directory
WORKDIR /var/www/html

# Enable SSL and mod_rewrite
RUN a2enmod ssl rewrite

# Copy index.html from the web directory
COPY web/index.html /var/www/html/index.html

# Copy the full web directory content (game folders, site assets, etc.)
COPY web/ /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Install PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Run Apache in the foreground
CMD ["apachectl", "-D", "FOREGROUND"]
