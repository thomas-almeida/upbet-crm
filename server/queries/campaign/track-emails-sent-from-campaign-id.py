from google.cloud import bigquery
from google.oauth2 import service_account
import csv
import os
from datetime import datetime
from collections import defaultdict

# Caminho para o arquivo de credenciais JSON
CREDENTIALS_PATH = "../../utils/credentials.json"

# Cria credenciais a partir do arquivo JSON
credentials = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)

# Configura o cliente do BigQuery
client = bigquery.Client(credentials=credentials)

CAMPAIGN_ID = '1049597'

# Nome do arquivo CSV baseado na data e hora
TIMESTAMP = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
CSV_DIR = './db/csv'
os.makedirs(CSV_DIR, exist_ok=True)
CSV_FILE_PATH = os.path.join(CSV_DIR, f'{CAMPAIGN_ID}_r_mails_sent_f_campaignid_{TIMESTAMP}.csv')

# Consulta SQL
QUERY = """
SELECT 
  a.audience_id, 
  a.audience_name, 
  j.resource_id,
  r.resource_name,
  r.resource_type_id,
  c.fact_date,
  c.fact_type_id,
  c.fact_details,
  c.user_ext_id,
FROM 
  dwh_ext_12023.j_av AS j
INNER JOIN 
  dwh_ext_12023.dm_audience AS a 
  ON j.audience_id = a.audience_id
INNER JOIN 
  dwh_ext_12023.dm_resource AS r 
  ON r.resource_id = j.resource_id
INNER JOIN 
  dwh_ext_12023.j_communication AS c 
  ON c.resource_id = j.resource_id
WHERE
  a.audience_id = 1049597
  AND r.resource_type_id IN (1)
  AND c.fact_type_id IN (2)
ORDER BY 
  j.event_date DESC
LIMIT 40000
"""

try:
    # Executa a consulta
    print("Executando a consulta...")
    query_job = client.query(QUERY)
    results = query_job.result()

    # Converte resultados em uma lista para contagem e debug
    rows = list(results)
    print(f"Número de linhas retornadas: {len(rows)}")

    # Verifica se há dados retornados
    if not rows:
        print("Nenhum dado encontrado.")
    else:
        # Dicionário para agrupar os dados por resource_id e filtrar user_ext_id únicos
        aggregated_data = defaultdict(lambda: defaultdict(set))

        for row in rows:
            # Adiciona os dados ao dicionário agrupados por resource_id e filtra user_ext_id únicos
            resource_id = row.resource_id
            user_ext_id = row.user_ext_id

            # Garantir que cada user_ext_id seja único dentro de cada resource_id
            if user_ext_id not in aggregated_data[resource_id]:
                aggregated_data[resource_id][user_ext_id] = {
                    'audience_id': row.audience_id,
                    'audience_name': row.audience_name,
                    'resource_name': row.resource_name,
                    'resource_type_id': row.resource_type_id,
                    'fact_date': row.fact_date,
                    'fact_type_id': row.fact_type_id,
                    'fact_details': row.fact_details,
                    'user_ext_id': user_ext_id,
                }

        # Cria ou sobrescreve o arquivo CSV
        with open(CSV_FILE_PATH, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)

            # Escreve o cabeçalho (nomes das colunas)
            writer.writerow([
                'audience_id', 'audience_name', 'resource_id', 'resource_name', 
                'resource_type_id', 'fact_date','fact_type_id', 'fact_details', 
                'user_ext_id'
            ])

            # Escreve os dados agrupados, mas agora com user_ext_id único por resource_id
            for resource_id, user_data in aggregated_data.items():
                for user_ext_id, data in user_data.items():
                    writer.writerow([
                        data['audience_id'],
                        data['audience_name'],
                        resource_id,
                        data['resource_name'],
                        data['resource_type_id'],
                        data['fact_date'],
                        data['fact_type_id'],
                        data['fact_details'],
                        data['user_ext_id'],
                    ])

        print(f"Dados exportados para {CSV_FILE_PATH} com sucesso.")

        with open(CSV_FILE_PATH, 'r', encoding='utf-8') as csvfile:
            line_count = sum(1 for _ in csvfile) - 1
        print(f"total de items: {line_count}")

except Exception as e:
    print(f"Ocorreu um erro: {e}")
