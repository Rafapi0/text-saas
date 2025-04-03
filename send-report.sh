#!/bin/bash

# Configurações
REPORT_DIR="performance_reports"
EMAIL_TO="seu-email@exemplo.com"  # Substituir pelo email do destinatário
EMAIL_SUBJECT="Relatório de Performance - $(date '+%d/%m/%Y')"

# Função para enviar email
send_email() {
    local report_file=$1
    local report_name=$(basename $report_file)
    
    # Verificar se o arquivo existe
    if [ ! -f "$report_file" ]; then
        echo "Erro: Arquivo $report_file não encontrado"
        return 1
    fi
    
    # Enviar email usando o comando mail
    echo "Enviando relatório $report_name para $EMAIL_TO..."
    
    # Corpo do email
    cat << EOF | mail -s "$EMAIL_SUBJECT" -a "$report_file" "$EMAIL_TO"
Prezado(a),

Segue em anexo o relatório de performance gerado em $(date '+%d/%m/%Y %H:%M:%S').

Este relatório contém informações sobre:
- Custos AWS
- Performance do Lambda
- Performance do DynamoDB
- Performance do S3
- Performance do CloudFront

Atenciosamente,
Sistema de Monitoramento
EOF
    
    if [ $? -eq 0 ]; then
        echo "✓ Relatório enviado com sucesso"
    else
        echo "✗ Erro ao enviar relatório"
    fi
}

# Enviar o relatório mais recente
LATEST_REPORT=$(ls -t $REPORT_DIR/report_*.html 2>/dev/null | head -n1)

if [ -n "$LATEST_REPORT" ]; then
    send_email "$LATEST_REPORT"
else
    echo "Nenhum relatório encontrado em $REPORT_DIR"
    exit 1
fi 