import requests
import json
from datetime import datetime, timedelta

url = "URL DO SEU WEBHOOK"

start_time = datetime.now() + timedelta(days=1)
start_time = start_time.replace(second=0, microsecond=0)
end_time = start_time + timedelta(hours=1)

payload = {
    "summary": "Evento de Teste via Python",
    "description": "Este evento foi enviado por um script Python.",
    "location": "Webhook Test",
    "startDateTime": start_time.strftime("%Y-%m-%dT%H:%M:%S"), 
    "endDateTime": end_time.strftime("%Y-%m-%dT%H:%M:%S"),
    "timezone": "America/Sao_Paulo",
    "attendees": [
        {"email": "usuario@exemplo.com"}
    ],
    "sendNotifications": True,
    "addGoogleMeet": True
}

print(f"Enviando dados para: {url}")
print("Payload:")
print(json.dumps(payload, indent=2, ensure_ascii=False))

try:
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        print("\n--- SUCESSO! ---")
        print(f"Código de Status: {response.status_code}")
            
    else:
        print(f"\n--- ERRO! ---")
        print(f"Código de Status: {response.status_code}")

except requests.exceptions.ConnectionError as e:
    print(f"\n--- ERRO DE CONEXÃO ---")
    print(f"Não foi possível conectar à URL. Verifique sua internet ou o URL.")
    print(f"Detalhes: {e}")
except Exception as e:
    print(f"\n--- OCORREU UM ERRO INESPERADO ---")
    print(f"Detalhes: {e}")