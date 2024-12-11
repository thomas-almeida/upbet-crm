from google.cloud import bigquery
from google.oauth2 import service_account
import csv
import os
from datetime import datetime

# Caminho para o arquivo de credenciais JSON
credentials_path = "../../utils/credentials.json"

# Cria credenciais a partir do arquivo JSON
credentials = service_account.Credentials.from_service_account_file(credentials_path)

# Configura o cliente do BigQuery
client = bigquery.Client(credentials=credentials)

# Lista de níveis conhecidos
known_levels = [
    1209, 1208, 1207, 1206, 1196, 1195, 1194, 1193, 1192, 1190,
    1189, 1188, 1187, 1186, 1185, 946, 927, 908, 890
]

# Consulta SQL para consolidar os dados e contar o número de usuários por nível
query = """
SELECT 
    t.to_level_id AS level_id, -- Nível do usuário
    COUNT(DISTINCT t.user_ext_id) AS user_count -- Contagem de usuários únicos no nível
FROM 
    dwh_ext_12023.g_ach_levels_changed AS t
WHERE 
    TIMESTAMP(t.fact_date) BETWEEN TIMESTAMP('2023-11-30 00:00:00-03:00') AND TIMESTAMP('2024-12-09 23:59:59-03:00')
GROUP BY 
    t.to_level_id
ORDER BY 
    level_id
"""

# Caminho da pasta onde o CSV será salvo
csv_dir = './db/csv'
os.makedirs(csv_dir, exist_ok=True)

try:
    # Executa a consulta
    print("Executando a consulta...")
    query_job = client.query(query)
    results = query_job.result()

    # Processa os resultados da consulta em um dicionário
    level_counts = {row.level_id: row.user_count for row in results}

    # Adiciona níveis que não foram encontrados na consulta com contagem 0
    for level in known_levels:
        if level not in level_counts:
            level_counts[level] = 0

    # Ordena os resultados por nível (para consistência)
    sorted_levels = sorted(level_counts.items())

    # Nome do arquivo CSV baseado na data e hora
    timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    csv_file_path = os.path.join(csv_dir, f'results-{timestamp}.csv')

    # Escreve o resultado em um arquivo CSV
    with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)

        # Escreve o cabeçalho
        writer.writerow(['level_id', 'user_count'])

        # Escreve os dados
        for level_id, user_count in sorted_levels:
            print(f"Nível: {level_id}, Usuários: {user_count}")  # Log para debug
            writer.writerow([level_id, user_count])

    print(f"Dados exportados para {csv_file_path} com sucesso.")

except Exception as e:
    print(f"Ocorreu um erro: {e}")
