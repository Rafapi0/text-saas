#!/bin/bash

domains=(seu-dominio.com)
email="seu-email@exemplo.com"
staging=0 # Set to 1 if you're testing your setup

# Criar diretórios para o Certbot
mkdir -p certbot/conf certbot/www

# Parar containers existentes
docker-compose -f docker-compose.prod.yml down

# Deletar certificados existentes
rm -rf certbot/conf/*

# Criar arquivo de configuração do Nginx temporário
cat > nginx.conf.tmp << EOF
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name ${domains[0]};

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://\$host\$request_uri;
        }
    }
}
EOF

# Iniciar Nginx temporariamente
docker-compose -f docker-compose.prod.yml up --force-recreate -d nginx

# Obter certificados
docker-compose -f docker-compose.prod.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email $email \
    -d ${domains[0]} \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot

# Restaurar configuração do Nginx
mv nginx.conf.tmp nginx.conf

# Reiniciar containers
docker-compose -f docker-compose.prod.yml up -d 