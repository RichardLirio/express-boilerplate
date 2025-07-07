#!/bin/sh

# Docker entrypoint script para Express Boilerplate com Prisma
# Este script executa comandos do Prisma antes de iniciar a aplicação

set -e

echo "🚀 Iniciando Express Boilerplate com Prisma..."

# Função para aguardar o banco de dados ficar disponível
wait_for_db() {
    echo "⏳ Aguardando banco de dados ficar disponível..."
    
    # Extrai informações da DATABASE_URL
    DB_HOST=$(echo $DATABASE_URL | sed 's/.*@\([^:]*\):.*/\1/')
    DB_PORT=$(echo $DATABASE_URL | sed 's/.*:\([0-9]*\)\/.*/\1/')
    DB_USER=$(echo $DATABASE_URL | sed 's/.*\/\/\([^:]*\):.*/\1/')
    DB_NAME=$(echo $DATABASE_URL | sed 's/.*\/\([^?]*\).*/\1/')
    
    # Aguarda até o banco estar disponível
    until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME; do
        echo "🔄 Banco de dados não disponível ainda, aguardando 3 segundos..."
        sleep 3
    done
    
    echo "✅ Banco de dados disponível!"
}

# Função para executar comandos do Prisma
run_prisma_commands() {
    echo "🔧 Executando comandos do Prisma..."
    
    # 1. Gerar o cliente Prisma
    echo "📦 Gerando cliente Prisma..."
    npx prisma generate
    
    # 2. Executar migrações (deploy)
    echo "🗄️ Executando migrações do banco de dados..."
    npx prisma migrate deploy
    
    # 3. Executar seed (se existir)
    if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
        echo "🌱 Executando seed do banco de dados..."
        npx prisma db seed
    else
        echo "ℹ️ Nenhum arquivo de seed encontrado, pulando..."
    fi
    
    echo "✅ Comandos do Prisma executados com sucesso!"
}

# Função principal
main() {
    # Aguarda o banco de dados
    wait_for_db
    
    # Executa comandos do Prisma apenas se DATABASE_URL estiver definida
    if [ -n "$DATABASE_URL" ]; then
        run_prisma_commands
    else
        echo "⚠️ DATABASE_URL não definida, pulando comandos do Prisma"
    fi
    
    echo "🎉 Iniciando aplicação..."
    
    # Executa o comando passado como argumento
    exec "$@"
}

# Executa a função principal com todos os argumentos
main "$@"