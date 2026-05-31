FROM php:8.1-fpm

# Cài đặt các thư viện hệ thống cần thiết
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libjpeg-dev \
    libfreetype6-dev

# Xóa cache apt
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Cài đặt các extension PHP cần thiết cho Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip opcache

# Cài đặt Composer
COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

# Cài đặt Node.js và Yarn (để build assets của Admin panel)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install --global yarn

WORKDIR /var/www

# Copy toàn bộ source backend vào container
COPY . .

# Cài đặt PHP dependencies (bỏ qua dev dependencies)
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Tạo file .env nếu chưa có
RUN cp .env.example .env

# Cài đặt JS packages, sinh Route Ziggy và build static assets cho Admin panel
RUN yarn install && yarn build

# Cấp quyền cho thư mục cache và storage
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
