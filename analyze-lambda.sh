#!/bin/bash

# Configurações
LOG_FILE="lambda_performance.log"
FUNCTION_NAME="document_processor"
REGION="eu-west-1"

# Função para registrar logs
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Analisar duração das execuções
analyze_duration() {
    local avg_duration=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/Lambda \
        --metric-name Duration \
        --dimensions Name=FunctionName,Value=$FUNCTION_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[*].Average' \
        --output text | awk '{sum += $1} END {print sum/NR}')

    log "Duração média das execuções: ${avg_duration}ms"
}

# Analisar uso de memória
analyze_memory() {
    local memory_usage=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/Lambda \
        --metric-name MemoryUtilization \
        --dimensions Name=FunctionName,Value=$FUNCTION_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[*].Average' \
        --output text | awk '{sum += $1} END {print sum/NR}')

    log "Uso médio de memória: ${memory_usage}%"
}

# Analisar taxa de erros
analyze_errors() {
    local total_invocations=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/Lambda \
        --metric-name Invocations \
        --dimensions Name=FunctionName,Value=$FUNCTION_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    local total_errors=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/Lambda \
        --metric-name Errors \
        --dimensions Name=FunctionName,Value=$FUNCTION_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    local error_rate=$(echo "scale=2; ($total_errors / $total_invocations) * 100" | bc)

    log "Taxa de erros: ${error_rate}%"
}

# Analisar cold starts
analyze_cold_starts() {
    local cold_starts=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/Lambda \
        --metric-name ColdStartDuration \
        --dimensions Name=FunctionName,Value=$FUNCTION_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    log "Total de cold starts: $cold_starts"
}

# Executar análises
log "Iniciando análise de performance do Lambda..."
analyze_duration
analyze_memory
analyze_errors
analyze_cold_starts
log "Análise concluída." 