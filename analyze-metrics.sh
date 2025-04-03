#!/bin/bash

# Configurações
LOG_FILE="business_metrics.log"
DATE=$(date +%Y%m%d)

# Função para registrar logs
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Analisar assinaturas ativas
analyze_subscriptions() {
    local active_subscriptions=$(aws dynamodb scan \
        --table-name users \
        --filter-expression "subscriptionStatus = :status" \
        --expression-attribute-values '{":status": {"S": "active"}}' \
        --query 'Count' \
        --output text)

    local basic_plan=$(aws dynamodb scan \
        --table-name users \
        --filter-expression "subscriptionStatus = :status AND planId = :plan" \
        --expression-attribute-values '{":status": {"S": "active"}, ":plan": {"S": "price_monthly_29"}}' \
        --query 'Count' \
        --output text)

    local pro_plan=$(aws dynamodb scan \
        --table-name users \
        --filter-expression "subscriptionStatus = :status AND planId = :plan" \
        --expression-attribute-values '{":status": {"S": "active"}, ":plan": {"S": "price_monthly_99"}}' \
        --query 'Count' \
        --output text)

    log "Assinaturas Ativas: $active_subscriptions"
    log "Plano Básico: $basic_plan"
    log "Plano Pro: $pro_plan"
}

# Calcular receita mensal
calculate_revenue() {
    local basic_revenue=$((basic_plan * 29))
    local pro_revenue=$((pro_plan * 99))
    local total_revenue=$((basic_revenue + pro_revenue))

    log "Receita Mensal:"
    log "Plano Básico: €$basic_revenue"
    log "Plano Pro: €$pro_revenue"
    log "Total: €$total_revenue"
}

# Analisar uso do serviço
analyze_usage() {
    local total_documents=$(aws dynamodb scan \
        --table-name users \
        --projection-expression "creditsUsed" \
        --query 'Items[*].creditsUsed.N' \
        --output text | awk '{sum += $1} END {print sum}')

    local avg_documents_per_user=$(echo "scale=2; $total_documents / $active_subscriptions" | bc)

    log "Uso do Serviço:"
    log "Total de Documentos Processados: $total_documents"
    log "Média de Documentos por Usuário: $avg_documents_per_user"
}

# Analisar taxa de retenção
analyze_retention() {
    local total_users=$(aws dynamodb scan \
        --table-name users \
        --query 'Count' \
        --output text)

    local retention_rate=$(echo "scale=2; ($active_subscriptions / $total_users) * 100" | bc)

    log "Taxa de Retenção: $retention_rate%"
}

# Executar análises
log "Iniciando análise de métricas de negócio..."
analyze_subscriptions
calculate_revenue
analyze_usage
analyze_retention
log "Análise concluída." 