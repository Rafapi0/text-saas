#!/bin/bash

# Configurações
BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
TABLE_NAME="users"

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Exportar dados do DynamoDB
echo "Iniciando backup da tabela $TABLE_NAME..."
aws dynamodb scan \
    --table-name $TABLE_NAME \
    --output json > "$BACKUP_DIR/${TABLE_NAME}_${DATE}.json"

# Comprimir backup
echo "Comprimindo backup..."
gzip "$BACKUP_DIR/${TABLE_NAME}_${DATE}.json"

# Manter apenas os últimos 7 backups
echo "Removendo backups antigos..."
ls -t $BACKUP_DIR/${TABLE_NAME}_*.json.gz | tail -n +8 | xargs -r rm

echo "Backup concluído: $BACKUP_DIR/${TABLE_NAME}_${DATE}.json.gz" 