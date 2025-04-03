#!/bin/bash

# Configurações
LOG_FILE="aws_costs.log"
BUDGET_LIMIT=1000 # Limite de orçamento em euros
REGION="eu-west-1"

# Função para registrar logs
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Obter custos do mês atual
get_current_costs() {
    local start_date=$(date -d "1 month ago" +%Y-%m-%d)
    local end_date=$(date +%Y-%m-%d)

    local costs=$(aws ce get-cost-and-usage \
        --time-period Start=$start_date,End=$end_date \
        --granularity MONTHLY \
        --metrics "BlendedCost" \
        --query 'ResultsByTime[0].Total.BlendedCost.Amount' \
        --output text)

    echo $costs
}

# Analisar custos por serviço
analyze_service_costs() {
    local start_date=$(date -d "1 month ago" +%Y-%m-%d)
    local end_date=$(date +%Y-%m-%d)

    echo "Custos por serviço:"
    aws ce get-cost-and-usage \
        --time-period Start=$start_date,End=$end_date \
        --granularity MONTHLY \
        --metrics "BlendedCost" \
        --group-by Type=DIMENSION,Key=SERVICE \
        --query 'ResultsByTime[0].Groups[*].[ServiceName,Total.BlendedCost.Amount]' \
        --output text | while read -r service cost; do
            log "$service: €$cost"
        done
}

# Verificar tendências de custo
check_cost_trends() {
    local current_costs=$(get_current_costs)
    local previous_costs=$(aws ce get-cost-and-usage \
        --time-period Start=$(date -d "2 months ago" +%Y-%m-%d),End=$(date -d "1 month ago" +%Y-%m-%d) \
        --granularity MONTHLY \
        --metrics "BlendedCost" \
        --query 'ResultsByTime[0].Total.BlendedCost.Amount' \
        --output text)

    local cost_change=$(echo "scale=2; (($current_costs - $previous_costs) / $previous_costs) * 100" | bc)

    log "Variação de custos: $cost_change%"
}

# Verificar alertas de orçamento
check_budget_alerts() {
    local current_costs=$(get_current_costs)
    
    if (( $(echo "$current_costs > $BUDGET_LIMIT" | bc -l) )); then
        log "ALERTA: Custos excederam o limite de orçamento de €$BUDGET_LIMIT"
        log "Custos atuais: €$current_costs"
    fi
}

# Executar monitoramento
log "Iniciando monitoramento de custos AWS..."
analyze_service_costs
check_cost_trends
check_budget_alerts
log "Monitoramento concluído." 