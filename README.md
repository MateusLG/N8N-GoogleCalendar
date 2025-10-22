# Fluxo n8n: Google Calendar

## Fluxo 

```
Webhook → Processar Tudo → Google Calendar → Responder Webhook
```

---

## Estrutura do Fluxo

### Node 1: Webhook (Trigger)
**Tipo**: `Webhook`
- Adicione o link do webhook a variavel url no arquivo post-webhook.py

**Configurações**:
- **HTTP Method**: POST
- **Path**: `/create-event`
- **Response Mode**: Last Node
- **Response Code**: 200

**Payload Esperado**:
```json
{
  "summary": "Reunião de Planejamento",
  "description": "Discussão sobre roadmap",
  "location": "Sala A",
  "startDateTime": "2025-10-28T10:00:00",
  "endDateTime": "2025-10-28T11:00:00",
  "timezone": "America/Sao_Paulo",
  "attendees": [
    {
      "email": "participante@example.com"
    }
  ]
}
```

---

### Node 2: Processar e Validar Tudo
**Tipo**: `Code`

```
Codigo contido no arquivo logica.js
```

### Node 3: Google Calendar - Criar Evento
**Tipo**: `Google Calendar`

**Configurações**:
- **Credential**: Selecione sua OAuth2
- **Resource**: Calendar
- **Operation**: Create an Event
- **Calendar**: `primary`

**Campos Básicos**:
- **Event Name**: `{{ $json.eventData.summary }}`
- **Start**: `{{ $json.eventData.start.dateTime }}`
- **End**: `{{ $json.eventData.end.dateTime }}`

**Additional Fields**:
- **Description**: `{{ $json.eventData.description }}`
- **Location**: `{{ $json.eventData.location }}`
- **Timezone**: `{{ $json.eventData.start.timeZone }}`
- **Send Updates**: `{{ $json.sendUpdates }}`
- **Color**: `{{ $json.eventData.colorId }}`

**Para Attendees**:
- Clique em **Add Field** → **Attendees**
- Use: `{{ $json.eventData.attendees }}`

**Para Google Meet**:
- Em **Options** → **Conference Data Version**: 1

---

### Node 4: 
**Tipo**: `If`
Caso o nó 3 (Criar Evento) retorne status de confirmado o fluxo continua o fluxo para um node de WebHook Response e retorna codigo 200, caso contrario, continua o fluxo para um node de WebHook Response e retorna codigo 400.

## Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/MateusLG/N8N-GoogleCalendar.git
    cd MCP-Wikipedia
    ```

2.  **Crie e ative o ambiente virtual (com UV):**
    ```bash
    # Cria o ambiente virtual na pasta .venv
    uv venv
    
    # Ativa o ambiente (Windows)
    .\.venv\Scripts\activate
    
    # Ativa o ambiente (Linux/macOS)
    source .venv/bin/activate
    ```

3.  **Instale as dependências (com UV):**
    ```bash
    uv pip install -r requirements.txt
    ```
  
### Execução

1. Inicie o Workflow
2. Execute o arquivo ```post-webhook.py``` para fazer o POST
