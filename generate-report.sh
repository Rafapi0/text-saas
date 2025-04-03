#!/bin/bash

# Configurações
REPORT_DIR="performance_reports"
DATE=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$REPORT_DIR/report_${DATE}.html"

# Criar diretório de relatórios se não existir
mkdir -p $REPORT_DIR

# Função para ler o último log de um serviço
get_latest_log() {
    local service=$1
    local log_file=$(ls -t performance_logs/${service}_*.log 2>/dev/null | head -n1)
    if [ -n "$log_file" ]; then
        cat "$log_file"
    else
        echo "Nenhum log encontrado para $service"
    fi
}

# Gerar cabeçalho HTML
cat > $REPORT_FILE << EOF
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Performance - $(date '+%d/%m/%Y %H:%M:%S')</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .section h2 {
            color: #444;
            margin-top: 0;
        }
        .metric {
            margin: 10px 0;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        .metric-name {
            font-weight: bold;
            color: #666;
        }
        .metric-value {
            color: #333;
        }
        .timestamp {
            text-align: center;
            color: #666;
            font-size: 0.9em;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Relatório de Performance</h1>
        <div class="timestamp">Gerado em: $(date '+%d/%m/%Y %H:%M:%S')</div>
EOF

# Adicionar seção de custos
cat >> $REPORT_FILE << EOF
        <div class="section">
            <h2>Custos AWS</h2>
            <div class="metric">
                <div class="metric-name">Última análise de custos:</div>
                <div class="metric-value">
                    <pre>$(get_latest_log "costs")</pre>
                </div>
            </div>
        </div>
EOF

# Adicionar seção de Lambda
cat >> $REPORT_FILE << EOF
        <div class="section">
            <h2>Performance do Lambda</h2>
            <div class="metric">
                <div class="metric-name">Última análise do Lambda:</div>
                <div class="metric-value">
                    <pre>$(get_latest_log "lambda")</pre>
                </div>
            </div>
        </div>
EOF

# Adicionar seção de DynamoDB
cat >> $REPORT_FILE << EOF
        <div class="section">
            <h2>Performance do DynamoDB</h2>
            <div class="metric">
                <div class="metric-name">Última análise do DynamoDB:</div>
                <div class="metric-value">
                    <pre>$(get_latest_log "dynamodb")</pre>
                </div>
            </div>
        </div>
EOF

# Adicionar seção de S3
cat >> $REPORT_FILE << EOF
        <div class="section">
            <h2>Performance do S3</h2>
            <div class="metric">
                <div class="metric-name">Última análise do S3:</div>
                <div class="metric-value">
                    <pre>$(get_latest_log "s3")</pre>
                </div>
            </div>
        </div>
EOF

# Adicionar seção de CloudFront
cat >> $REPORT_FILE << EOF
        <div class="section">
            <h2>Performance do CloudFront</h2>
            <div class="metric">
                <div class="metric-name">Última análise do CloudFront:</div>
                <div class="metric-value">
                    <pre>$(get_latest_log "cloudfront")</pre>
                </div>
            </div>
        </div>
EOF

# Fechar HTML
cat >> $REPORT_FILE << EOF
    </div>
</body>
</html>
EOF

echo "Relatório gerado com sucesso: $REPORT_FILE" 