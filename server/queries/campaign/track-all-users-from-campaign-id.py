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

CAMPAIGN_ID = "1053611"

# Nome do arquivo CSV baseado na data e hora
TIMESTAMP = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
CSV_DIR = './db/csv'
os.makedirs(CSV_DIR, exist_ok=True)
CSV_FILE_PATH = os.path.join(CSV_DIR, f'{CAMPAIGN_ID}_r_track_usr_f_campaignid_{TIMESTAMP}.csv')

# Consulta SQL
QUERY = """
SELECT 
  a.audience_id, 
  j.resource_id,
  c.fact_date,
  c.user_ext_id,
FROM 
  dwh_ext_12023.j_av AS j
INNER JOIN 
  dwh_ext_12023.dm_audience AS a 
  ON j.audience_id = a.audience_id
INNER JOIN 
  dwh_ext_12023.j_communication AS c 
  ON c.resource_id = j.resource_id
WHERE
  a.audience_id = 1053611
ORDER BY 
  j.event_date DESC
LIMIT 200000
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
                    'user_ext_id': user_ext_id,
                    'fact_date': row.fact_date,
                    'resource_id': row.resource_id,

                }

        # Cria ou sobrescreve o arquivo CSV
        with open(CSV_FILE_PATH, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)

            # Escreve o cabeçalho (nomes das colunas)
            writer.writerow([
                'audience_id', 
                'user_ext_id', 
                'fact_date',
                'resource_id'
            ])

            # Escreve os dados agrupados, mas agora com user_ext_id único por resource_id
            for resource_id, user_data in aggregated_data.items():
                for user_ext_id, data in user_data.items():
                    writer.writerow([
                        data['audience_id'],
                        data['user_ext_id'],
                        data['fact_date'],
                        data['resource_id']
                    ])

        print(f"Dados exportados para {CSV_FILE_PATH} com sucesso.")

except Exception as e:
    print(f"Ocorreu um erro: {e}")
