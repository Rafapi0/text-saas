#!/bin/bash

# Configurações
ALARM_THRESHOLD=80 # Porcentagem de uso
REGION="eu-west-1"
LOG_FILE="aws_monitoring.log"

# Função para registrar logs
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Verificar uso de CPU do Lambda
check_lambda_cpu() {
    local function_name="document_processor"
    local cpu_usage=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/Lambda \
        --metric-name CPUUtilization \
        --dimensions Name=FunctionName,Value=$function_name \
        --start-time $(date -d '5 minutes ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[0].Average' \
        --output text)

    if (( $(echo "$cpu_usage > $ALARM_THRESHOLD" | bc -l) )); then
        log "ALERTA: Uso de CPU do Lambda $function_name está em $cpu_usage%"
    fi
}

# Verificar uso de memória do DynamoDB
check_dynamodb_memory() {
    local table_name="users"
    local memory_usage=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/DynamoDB \
        --metric-name ConsumedReadCapacityUnits \
        --dimensions Name=TableName,Value=$table_name \
        --start-time $(date -d '5 minutes ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[0].Sum' \
        --output text)

    if (( $(echo "$memory_usage > $ALARM_THRESHOLD" | bc -l) )); then
        log "ALERTA: Uso de memória do DynamoDB $table_name está em $memory_usage%"
    fi
}

# Verificar erros do Lambda
check_lambda_errors() {
    local function_name="document_processor"
    local error_count=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/Lambda \
        --metric-name Errors \
        --dimensions Name=FunctionName,Value=$function_name \
        --start-time $(date -d '5 minutes ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[0].Sum' \
        --output text)

    if [ "$error_count" != "None" ] && [ "$error_count" -gt 0 ]; then
        log "ALERTA: Lambda $function_name teve $error_count erros nos últimos 5 minutos"
    fi
}

# Executar verificações
log "Iniciando monitoramento de recursos AWS..."
check_lambda_cpu
check_dynamodb_memory
check_lambda_errors
log "Monitoramento concluído." 