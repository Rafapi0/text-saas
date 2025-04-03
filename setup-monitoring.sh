#!/bin/bash

# Configurações
SCRIPT_DIR=$(pwd)
CRON_LOG_DIR="$SCRIPT_DIR/cron_logs"
PERFORMANCE_LOG_DIR="$SCRIPT_DIR/performance_logs"

# Criar diretórios de log se não existirem
mkdir -p $CRON_LOG_DIR
mkdir -p $PERFORMANCE_LOG_DIR

# Função para adicionar entrada no crontab
add_cron_job() {
    local schedule=$1
    local command=$2
    local job="$schedule $command"
    
    # Verificar se o job já existe
    if ! crontab -l 2>/dev/null | grep -q "$command"; then
        (crontab -l 2>/dev/null; echo "$job") | crontab -
        echo "✓ Job adicionado: $job"
    else
        echo "! Job já existe: $job"
    fi
}

# Configurar jobs do crontab

# Análise de custos - Diariamente às 00:00
add_cron_job "0 0 * * *" "cd $SCRIPT_DIR && bash monitor-costs.sh >> $CRON_LOG_DIR/costs_$(date +\%Y\%m\%d).log 2>&1"

# Análise de Lambda - A cada 5 minutos
add_cron_job "*/5 * * * *" "cd $SCRIPT_DIR && bash analyze-lambda.sh >> $CRON_LOG_DIR/lambda_$(date +\%Y\%m\%d).log 2>&1"

# Análise de DynamoDB - A cada 5 minutos
add_cron_job "*/5 * * * *" "cd $SCRIPT_DIR && bash analyze-dynamodb.sh >> $CRON_LOG_DIR/dynamodb_$(date +\%Y\%m\%d).log 2>&1"

# Análise de S3 - A cada 5 minutos
add_cron_job "*/5 * * * *" "cd $SCRIPT_DIR && bash analyze-s3.sh >> $CRON_LOG_DIR/s3_$(date +\%Y\%m\%d).log 2>&1"

# Análise de CloudFront - A cada 5 minutos
add_cron_job "*/5 * * * *" "cd $SCRIPT_DIR && bash analyze-cloudfront.sh >> $CRON_LOG_DIR/cloudfront_$(date +\%Y\%m\%d).log 2>&1"

# Análise completa - Diariamente às 01:00
add_cron_job "0 1 * * *" "cd $SCRIPT_DIR && bash analyze-all.sh >> $CRON_LOG_DIR/complete_$(date +\%Y\%m\%d).log 2>&1"

# Limpar logs antigos - Semanalmente aos domingos às 02:00
add_cron_job "0 2 * * 0" "find $CRON_LOG_DIR -name '*.log' -mtime +30 -delete && find $PERFORMANCE_LOG_DIR -name '*.log' -mtime +30 -delete"

echo "----------------------------------------"
echo "Configuração do monitoramento concluída"
echo "Logs do crontab disponíveis em: $CRON_LOG_DIR"
echo "Logs de performance disponíveis em: $PERFORMANCE_LOG_DIR"
echo "----------------------------------------"
echo "Jobs configurados:"
crontab -l 