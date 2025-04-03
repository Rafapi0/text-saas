#!/bin/bash

# Parar containers existentes
docker-compose -f docker-compose.prod.yml down

# Construir imagens
docker-compose -f docker-compose.prod.yml build

# Iniciar containers
docker-compose -f docker-compose.prod.yml up -d

# Verificar logs
docker-compose -f docker-compose.prod.yml logs -f 