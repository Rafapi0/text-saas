#!/bin/bash

# Função para verificar se um comando está instalado
check_command() {
    if ! command -v $1 &> /dev/null; then
        return 1
    fi
    return 0
}

# Função para instalar dependências no Ubuntu/Debian
install_ubuntu_deps() {
    echo "Instalando dependências no Ubuntu/Debian..."
    sudo apt-get update
    sudo apt-get install -y \
        awscli \
        bc \
        mailutils \
        postfix \
        cron
}

# Função para instalar dependências no CentOS/RHEL
install_centos_deps() {
    echo "Instalando dependências no CentOS/RHEL..."
    sudo yum update -y
    sudo yum install -y \
        aws-cli \
        bc \
        mailx \
        postfix \
        cronie
}

# Função para instalar dependências no macOS
install_macos_deps() {
    echo "Instalando dependências no macOS..."
    if ! check_command "brew"; then
        echo "Instalando Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    brew install \
        awscli \
        bc \
        mailutils \
        postfix
}

# Detectar sistema operacional
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
elif [ -f /etc/redhat-release ]; then
    OS="CentOS"
elif [ "$(uname)" == "Darwin" ]; then
    OS="macOS"
else
    echo "Sistema operacional não suportado"
    exit 1
fi

echo "Sistema operacional detectado: $OS"

# Instalar dependências baseado no sistema operacional
case $OS in
    "Ubuntu"|"Debian GNU/Linux")
        install_ubuntu_deps
        ;;
    "CentOS"|"Red Hat Enterprise Linux")
        install_centos_deps
        ;;
    "macOS")
        install_macos_deps
        ;;
    *)
        echo "Sistema operacional não suportado: $OS"
        exit 1
        ;;
esac

# Configurar AWS CLI
if ! check_command "aws"; then
    echo "Erro: AWS CLI não foi instalado corretamente"
    exit 1
fi

# Verificar configuração do AWS CLI
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Configurando AWS CLI..."
    aws configure
fi

# Configurar Postfix
if [ "$OS" != "macOS" ]; then
    echo "Configurando Postfix..."
    sudo systemctl enable postfix
    sudo systemctl start postfix
fi

# Dar permissões de execução aos scripts
chmod +x *.sh

echo "----------------------------------------"
echo "Instalação de dependências concluída"
echo "----------------------------------------"
echo "Próximos passos:"
echo "1. Configure o email do destinatário em send-report.sh"
echo "2. Configure o ID da distribuição CloudFront em analyze-cloudfront.sh"
echo "3. Execute setup-monitoring.sh para configurar o monitoramento"
echo "4. Execute setup-reporting.sh para configurar o envio de relatórios" 