from google.cloud import bigquery
from google.oauth2 import service_account
import csv
import os
from datetime import datetime

# Caminho para o arquivo de credenciais JSON
credentials_path = "../utils/credentials.json"

# Cria credenciais a partir do arquivo JSON
credentials = service_account.Credentials.from_service_account_file(credentials_path)

# Configura o cliente do BigQuery
client = bigquery.Client(credentials=credentials)

# Consulta SQL com JOIN para incluir item_name
query = """
SELECT 
    t.create_date, -- Data de compra
    t.transaction_id,
    t.shop_item_id,
    t.points_amount,
    t.user_ext_id,
    t.crm_brand_id,
    s.item_name -- Nome do item, vindo da tabela dm_shop_item
FROM 
    dwh_ext_12023.g_shop_transactions AS t
LEFT JOIN 
    dwh_ext_12023.dm_shop_item AS s
    ON t.shop_item_id = s.item_id -- Chave de ligação entre as tabelas
WHERE 
    t.create_date BETWEEN TIMESTAMP('2024-12-01 00:00:00 UTC') AND TIMESTAMP('2024-12-05 23:59:59 UTC')
LIMIT 100000;
"""

# Caminho da pasta onde o CSV será salvo
csv_dir = './db/csv'

# Certifica-se de que o diretório existe
os.makedirs(csv_dir, exist_ok=True)

try:
    # Executa a consulta
    print("Executando a consulta...")
    query_job = client.query(query)
    results = query_job.result()

    # Converte resultados em uma lista para contagem e debug
    rows = list(results)
    print(f"Número de linhas retornadas: {len(rows)}")

    # Verifica se há dados retornados
    if len(rows) == 0:
        print("Nenhum dado encontrado.")
    else:
        # Nome do arquivo CSV baseado na data e hora
        timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        csv_file_path = os.path.join(csv_dir, f'results-{timestamp}.csv')

        # Escreve o resultado em um arquivo CSV
        with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)

            # Escreve o cabeçalho (nomes das colunas)
            writer.writerow(['create_date', 'transaction_id', 'shop_item_id', 'points_amount', 'user_ext_id', 'crm_brand_id', 'item_name'])

            # Escreve os dados
            for row in rows:
                print(f"Processando linha: {row}")  # Log para debug
                writer.writerow([row.create_date, row.transaction_id, row.shop_item_id, row.points_amount, row.user_ext_id, row.crm_brand_id, row.item_name])
        
        print(f"Dados exportados para {csv_file_path} com sucesso.")

except Exception as e:
    print(f"Ocorreu um erro: {e}")
