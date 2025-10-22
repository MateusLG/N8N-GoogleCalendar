let data = $input.item.json;

if (data.body) data = data.body;
if (data.json && typeof data.json === 'object') data = data.json;

if (typeof data === 'string') {
  try {
    data = JSON.parse(data);
  } catch (e) {
    return [{
      json: {
        success: false,
        error: 'JSON inválido',
        statusCode: 400
      }
    }];
  }
}

const required = ['summary', 'startDateTime', 'endDateTime'];
const missing = required.filter(field => !data[field]);

if (missing.length > 0) {
  return [{
    json: {
      success: false,
      error: `Campos obrigatórios faltando: ${missing.join(', ')}`,
      statusCode: 400
    }
  }];
}

const start = new Date(data.startDateTime);
const end = new Date(data.endDateTime);

if (isNaN(start.getTime()) || isNaN(end.getTime())) {
  return [{
    json: {
      success: false,
      error: 'Formato de data inválido. Use: YYYY-MM-DDTHH:mm:ss',
      statusCode: 400
    }
  }];
}

if (end <= start) {
  return [{
    json: {
      success: false,
      error: 'Data de término deve ser posterior à data de início',
      statusCode: 400
    }
  }];
}

const eventData = {
  summary: data.summary,
  description: data.description || '',
  location: data.location || '',
  start: {
    dateTime: data.startDateTime,
    timeZone: data.timezone || 'America/Sao_Paulo'
  },
  end: {
    dateTime: data.endDateTime,
    timeZone: data.timezone || 'America/Sao_Paulo'
  }
};

if (data.attendees && Array.isArray(data.attendees) && data.attendees.length > 0) {
  eventData.attendees = data.attendees.map(att => ({
    email: att.email,
    displayName: att.displayName || att.email.split('@')[0]
  }));
}

if (data.colorId) {
  eventData.colorId = data.colorId;
}

if (data.addGoogleMeet) {
  eventData.conferenceData = {
    createRequest: {
      requestId: `meet-${Date.now()}`,
      conferenceSolutionKey: {
        type: 'hangoutsMeet'
      }
    }
  };
}

return [{
  json: {
    valid: true,
    eventData: eventData,
    sendUpdates: data.sendNotifications ? 'all' : 'none'
  }
}];