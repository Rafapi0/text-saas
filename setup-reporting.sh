#!/bin/bash

# Configurações
SCRIPT_DIR=$(pwd)
CRON_LOG_DIR="$SCRIPT_DIR/cron_logs"
REPORT_DIR="$SCRIPT_DIR/performance_reports"

# Criar diretórios se não existirem
mkdir -p $CRON_LOG_DIR
mkdir -p $REPORT_DIR

# Função para adicionar entrada no crontab
add_cron_job() {
    local schedule=$1
    local command=$2
    local job="$schedule $command"
    
    # Verificar se o job já existe
    if ! crontab -l 2>/dev/null | grep -q "$command"; then
        (crontab -l 2>/dev/null; echo "$job") | crontab -
        echo "✓ Job adicionado: $job"
    else
        echo "! Job já existe: $job"
    fi
}

# Configurar jobs do crontab

# Gerar relatório diário - Todos os dias às 06:00
add_cron_job "0 6 * * *" "cd $SCRIPT_DIR && bash generate-report.sh >> $CRON_LOG_DIR/report_generation_$(date +\%Y\%m\%d).log 2>&1"

# Enviar relatório por email - Todos os dias às 07:00
add_cron_job "0 7 * * *" "cd $SCRIPT_DIR && bash send-report.sh >> $CRON_LOG_DIR/report_sending_$(date +\%Y\%m\%d).log 2>&1"

# Limpar relatórios antigos - Semanalmente aos domingos às 03:00
add_cron_job "0 3 * * 0" "find $REPORT_DIR -name 'report_*.html' -mtime +30 -delete"

echo "----------------------------------------"
echo "Configuração do envio de relatórios concluída"
echo "Logs do crontab disponíveis em: $CRON_LOG_DIR"
echo "Relatórios disponíveis em: $REPORT_DIR"
echo "----------------------------------------"
echo "Jobs configurados:"
crontab -l 