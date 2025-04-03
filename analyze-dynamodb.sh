#!/bin/bash

# Configurações
LOG_FILE="dynamodb_performance.log"
TABLE_NAME="users"
REGION="eu-west-1"

# Função para registrar logs
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Analisar latência de leitura
analyze_read_latency() {
    local read_latency=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/DynamoDB \
        --metric-name SuccessfulRequestLatency \
        --dimensions Name=TableName,Value=$TABLE_NAME Name=Operation,Value=GetItem \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[*].Average' \
        --output text | awk '{sum += $1} END {print sum/NR}')

    log "Latência média de leitura: ${read_latency}ms"
}

# Analisar latência de escrita
analyze_write_latency() {
    local write_latency=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/DynamoDB \
        --metric-name SuccessfulRequestLatency \
        --dimensions Name=TableName,Value=$TABLE_NAME Name=Operation,Value=PutItem \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[*].Average' \
        --output text | awk '{sum += $1} END {print sum/NR}')

    log "Latência média de escrita: ${write_latency}ms"
}

# Analisar consumo de capacidade
analyze_capacity_consumption() {
    local read_capacity=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/DynamoDB \
        --metric-name ConsumedReadCapacityUnits \
        --dimensions Name=TableName,Value=$TABLE_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    local write_capacity=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/DynamoDB \
        --metric-name ConsumedWriteCapacityUnits \
        --dimensions Name=TableName,Value=$TABLE_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    log "Consumo de capacidade de leitura: ${read_capacity} unidades"
    log "Consumo de capacidade de escrita: ${write_capacity} unidades"
}

# Analisar erros
analyze_errors() {
    local read_errors=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/DynamoDB \
        --metric-name SystemErrors \
        --dimensions Name=TableName,Value=$TABLE_NAME Name=Operation,Value=GetItem \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    local write_errors=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/DynamoDB \
        --metric-name SystemErrors \
        --dimensions Name=TableName,Value=$TABLE_NAME Name=Operation,Value=PutItem \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    log "Erros de leitura: ${read_errors}"
    log "Erros de escrita: ${write_errors}"
}

# Executar análises
log "Iniciando análise de performance do DynamoDB..."
analyze_read_latency
analyze_write_latency
analyze_capacity_consumption
analyze_errors
log "Análise concluída." 