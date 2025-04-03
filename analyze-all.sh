#!/bin/bash

# Configurações
LOG_DIR="performance_logs"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório de logs se não existir
mkdir -p $LOG_DIR

# Função para executar script e registrar saída
run_script() {
    local script_name=$1
    local log_file="$LOG_DIR/${script_name}_${DATE}.log"
    echo "Executando $script_name..."
    bash $script_name > $log_file 2>&1
    if [ $? -eq 0 ]; then
        echo "✓ $script_name concluído com sucesso"
    else
        echo "✗ Erro ao executar $script_name"
    fi
}

# Executar todas as análises
echo "Iniciando análise completa de performance..."
echo "Data/Hora: $(date)"
echo "----------------------------------------"

# Análise de custos
run_script "monitor-costs.sh"

# Análise de Lambda
run_script "analyze-lambda.sh"

# Análise de DynamoDB
run_script "analyze-dynamodb.sh"

# Análise de S3
run_script "analyze-s3.sh"

# Análise de CloudFront
run_script "analyze-cloudfront.sh"

echo "----------------------------------------"
echo "Análise completa concluída"
echo "Logs disponíveis em: $LOG_DIR" 