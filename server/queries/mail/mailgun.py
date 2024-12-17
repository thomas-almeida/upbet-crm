import csv
import requests
import time
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

# Defina a URL da API e a chave de API
url = "https://api.mailgun.net/v3/campaigns.upbet.com/messages"
api_key = "56e2433636725885e6581e59da84fb7d-0996409b-c187dd04"  # Substitua pela sua chave de API real

# Função para carregar emails do CSV
def load_emails_from_csv(file_path):
    email_list = []
    with open(file_path, mode='r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            email_list.append(row['email'])
    return email_list

# Função para enviar email
def send_email(to_email):
    data = {
        "from": "UPBET <postmaster@campaigns.upbet.com>",
        "to": to_email,
        "subject": "Na UPBET, só não ganha quem não quer! 🎰🤑",
        "template": "OFERTA 10 PRAGMATIC",
        "h:X-Mailgun-Variables": '{"test": "test"}'
    }

    try:    
        response = requests.post(
            url,
            auth=("api", api_key),
            data=data
        )
        if response.status_code != 200:
            return (to_email, False, response.status_code, response.text)
        else:
            return (to_email, True, response.status_code, "Email enviado")
    except requests.exceptions.RequestException as e:
        return (to_email, False, None, str(e))

# Caminho absoluto para o arquivo CSV
file_path = os.path.abspath('email.csv')  # Substitua pelo caminho absoluto do arquivo CSV

# Carregar emails do CSV
email_list = load_emails_from_csv(file_path)  # Certifique-se de que o caminho para o arquivo CSV está correto

# Configuração de envio em lotes
batch_size = 2000

delay_between_batches = 20  # Delay entre lotes em segundos (ajuste conforme necessário)

# Configuração de threads
max_threads = 10  # Ajuste conforme necessário

# Envio de emails com threads
total_emails = len(email_list)
with tqdm(total=total_emails, desc="Enviando emails") as pbar:
    for i in range(0, total_emails, batch_size):
        batch = email_list[i:i + batch_size]
        with ThreadPoolExecutor(max_threads) as executor:
            futures = [executor.submit(send_email, email) for email in batch]
            for future in as_completed(futures):
                result = future.result()
                email, success, status_code, message = result
                if not success:
                    print(f"Falha ao enviar email para {email}: {status_code} {message}")
                else:
                    print(f"Email enviado para {email}: {message}")
                pbar.update(1)
        # Espera antes de enviar o próximo lote
        time.sleep(delay_between_batches)

print("Envio concluído.")