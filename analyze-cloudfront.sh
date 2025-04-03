#!/bin/bash

# Configurações
LOG_FILE="cloudfront_performance.log"
DISTRIBUTION_ID="E1234567890ABCD"  # Substituir pelo ID real da distribuição
REGION="eu-west-1"

# Função para registrar logs
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Analisar latência de requisições
analyze_request_latency() {
    local latency=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/CloudFront \
        --metric-name Latency \
        --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[*].Average' \
        --output text | awk '{sum += $1} END {print sum/NR}')

    log "Latência média de requisições: ${latency}ms"
}

# Analisar taxa de hit
analyze_cache_hit_rate() {
    local hits=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/CloudFront \
        --metric-name CacheHitRate \
        --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[*].Average' \
        --output text | awk '{sum += $1} END {print sum/NR}')

    log "Taxa média de hit do cache: ${hits}%"
}

# Analisar requisições
analyze_requests() {
    local total_requests=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/CloudFront \
        --metric-name Requests \
        --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    local bytes_downloaded=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/CloudFront \
        --metric-name BytesDownloaded \
        --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[*].Sum' \
        --output text | awk '{sum += $1} END {print sum}')

    log "Total de requisições: ${total_requests}"
    log "Total de bytes baixados: ${bytes_downloaded}"
}

# Analisar erros
analyze_errors() {
    local error_rate=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/CloudFront \
        --metric-name ErrorRate \
        --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID \
        --start-time $(date -d '1 hour ago' -u +"%Y-%m-%dT%H:%M:%SZ") \
        --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[*].Average' \
        --output text | awk '{sum += $1} END {print sum/NR}')

    log "Taxa média de erros: ${error_rate}%"
}

# Executar análises
log "Iniciando análise de performance do CloudFront..."
analyze_request_latency
analyze_cache_hit_rate
analyze_requests
analyze_errors
log "Análise concluída." 