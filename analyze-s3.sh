#!/bin/bash

# Configurações
LOG_FILE="s3_performance.log"
BUCKET_NAME="document-processor-files"
REGION="eu-west-1"

# Função para registrar logs
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Analisar latência de requisições
analyze_request_latency() {
    local latency=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/S3 \
        --metric-name FirstByteLatency \
        --dimensions Name=BucketName,Value=$BUCKET_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[*].Average' \
        --output text | awk '{sum += $1} END {print sum/NR}')

    log "Latência média de requisições: ${latency}ms"
}

# Analisar número de requisições
analyze_requests() {
    local get_requests=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/S3 \
        --metric-name NumberOfGETRequests \
        --dimensions Name=BucketName,Value=$BUCKET_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    local put_requests=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/S3 \
        --metric-name NumberOfPUTRequests \
        --dimensions Name=BucketName,Value=$BUCKET_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    log "Total de requisições GET: ${get_requests}"
    log "Total de requisições PUT: ${put_requests}"
}

# Analisar bytes transferidos
analyze_bytes_transferred() {
    local bytes_downloaded=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/S3 \
        --metric-name BytesDownloaded \
        --dimensions Name=BucketName,Value=$BUCKET_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    local bytes_uploaded=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/S3 \
        --metric-name BytesUploaded \
        --dimensions Name=BucketName,Value=$BUCKET_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    log "Total de bytes baixados: ${bytes_downloaded}"
    log "Total de bytes enviados: ${bytes_uploaded}"
}

# Analisar erros
analyze_errors() {
    local errors=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/S3 \
        --metric-name 5xxErrors \
        --dimensions Name=BucketName,Value=$BUCKET_NAME \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    log "Total de erros 5xx: ${errors}"
}

# Executar análises
log "Iniciando análise de performance do S3..."
analyze_request_latency
analyze_requests
analyze_bytes_transferred
analyze_errors
log "Análise concluída." 