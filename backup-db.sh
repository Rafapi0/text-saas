#!/bin/bash

# Configurações
BACKUP_DIR="db_backups"
DATE=$(date +%Y%m%d_%H%M%S)
BUCKET_NAME="document-processor-backups"

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Exportar dados do DynamoDB
echo "Iniciando backup do banco de dados..."
aws dynamodb scan \
    --table-name users \
    --output json > "$BACKUP_DIR/users_${DATE}.json"

# Comprimir backup
echo "Comprimindo backup..."
gzip "$BACKUP_DIR/users_${DATE}.json"

# Fazer upload para o S3
echo "Fazendo upload para o S3..."
aws s3 cp "$BACKUP_DIR/users_${DATE}.json.gz" "s3://$BUCKET_NAME/backups/"

# Manter apenas os últimos 7 backups locais
echo "Removendo backups antigos..."
ls -t $BACKUP_DIR/users_*.json.gz | tail -n +8 | xargs -r rm

# Manter apenas os últimos 30 backups no S3
echo "Removendo backups antigos do S3..."
aws s3 ls "s3://$BUCKET_NAME/backups/" | sort -r | tail -n +31 | awk '{print $4}' | while read -r file; do
    aws s3 rm "s3://$BUCKET_NAME/backups/$file"
done

echo "Backup concluído: s3://$BUCKET_NAME/backups/users_${DATE}.json.gz" 