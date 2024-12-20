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

# Consulta SQL ajustada para agrupar por shop_item_id
query = """
SELECT 
    t.shop_item_id,
    s.item_name,
    SUM(t.points_amount) AS total_points_amount, -- Soma dos pontos por item
    COUNT(t.transaction_id) AS transaction_count -- Número de transações por item
FROM 
    dwh_ext_12023.g_shop_transactions AS t
LEFT JOIN 
    dwh_ext_12023.dm_shop_item AS s
    ON t.shop_item_id = s.item_id
WHERE 
    TIMESTAMP(t.create_date) BETWEEN TIMESTAMP('2024-11-30 00:00:00-03:00') AND TIMESTAMP('2024-12-09 23:59:59-03:00')
GROUP BY 
    t.shop_item_id, s.item_name
ORDER BY 
    total_points_amount DESC
LIMIT 1000000;
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
            writer.writerow(['shop_item_id', 'item_name', 'total_points_amount', 'transaction_count'])

            # Escreve os dados
            for row in rows:
                print(f"Processando linha: {row}")  # Log para debug
                writer.writerow([row.shop_item_id, row.item_name, row.total_points_amount, row.transaction_count])
        
        print(f"Dados exportados para {csv_file_path} com sucesso.")

except Exception as e:
    print(f"Ocorreu um erro: {e}")
