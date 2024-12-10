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

# Consulta SQL para consolidar os dados
query = """
SELECT 
    t.user_ext_id,
    SUM(t.points_collected) AS total_points_collected,
    MAX(t.user_points_ever) AS max_points_ever,
    MAX(t.user_points_balance) AS current_points_balance
FROM 
    dwh_ext_12023.g_ach_points_change_log AS t
WHERE 
    TIMESTAMP(t.create_date) BETWEEN TIMESTAMP('2024-11-30 00:00:00-03:00') AND TIMESTAMP('2024-12-09 23:59:59-03:00')
GROUP BY 
    t.user_ext_id
LIMIT 1000000;
"""

# Caminho da pasta onde o CSV será salvo
csv_dir = './db/csv'
os.makedirs(csv_dir, exist_ok=True)

try:
    # Executa a consulta
    print("Executando a consulta...")
    query_job = client.query(query)
    results = query_job.result()

    # Converte resultados em uma lista para contagem e debug
    rows = list(results)
    print(f"Número de linhas retornadas: {len(rows)}")

    if len(rows) == 0:
        print("Nenhum dado encontrado.")
    else:
        # Nome do arquivo CSV baseado na data e hora
        timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        csv_file_path = os.path.join(csv_dir, f'results-{timestamp}.csv')

        # Escreve o resultado em um arquivo CSV
        with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)

            # Escreve o cabeçalho
            writer.writerow(['user_ext_id', 'total_points_collected', 'max_points_ever', 'current_points_balance'])

            # Escreve os dados
            for row in rows:
                print(f"Processando linha: {row}")  # Log para debug
                writer.writerow([row.user_ext_id, row.total_points_collected, row.max_points_ever, row.current_points_balance])

        print(f"Dados exportados para {csv_file_path} com sucesso.")

except Exception as e:
    print(f"Ocorreu um erro: {e}")
