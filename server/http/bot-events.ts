// Endpoint para receber eventos em tempo real de bots externos (ex.: OpenMausBot / msbot).
// Rotas:
//   POST /api/bot-events  -> registra um evento de bot (setor, status, tarefa, mensagem)
//   GET  /api/bot-events  -> lista os eventos mais recentes recebidos
import type { IncomingMessage, ServerResponse } from 'node:http';

export interface BotEventPayload {
  botId: string;
  botName?: string;
  setor?: string;
  status?: 'working' | 'waiting' | 'idle' | 'done' | 'error';
  tarefa?: string;
  mensagem?: string;
  timestamp?: number;
}

export interface StoredBotEvent extends BotEventPayload {
  receivedAt: number;
}

const MAX_EVENTS = 200;
const recentBotEvents: StoredBotEvent[] = [];

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > 64 * 1024) {
        req.destroy();
        reject(new Error('Payload muito grande (máx. 64 KB)'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data),
  });
  res.end(data);
}

/** Atende GET e POST /api/bot-events. */
export async function handleBotEventsRoute(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method === 'GET') {
    sendJson(res, 200, { ok: true, count: recentBotEvents.length, events: recentBotEvents });
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'GET, POST', 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Método não permitido. Use GET ou POST.' }));
    return;
  }

  let parsed: unknown;
  try {
    const raw = await readBody(req);
    parsed = JSON.parse(raw || '{}');
  } catch (err) {
    sendJson(res, 400, { error: err instanceof Error ? err.message : 'JSON inválido' });
    return;
  }

  if (!parsed || typeof parsed !== 'object' || typeof (parsed as BotEventPayload).botId !== 'string' || !(parsed as BotEventPayload).botId.trim()) {
    sendJson(res, 400, { error: 'Campo obrigatório "botId" (string não vazia) ausente.' });
    return;
  }

  const payload = parsed as BotEventPayload;
  const stored: StoredBotEvent = {
    botId: payload.botId.trim(),
    botName: payload.botName?.trim() || payload.botId.trim(),
    setor: payload.setor?.trim() || 'Geral',
    status: payload.status ?? 'working',
    tarefa: payload.tarefa?.trim(),
    mensagem: payload.mensagem?.trim(),
    timestamp: typeof payload.timestamp === 'number' ? payload.timestamp : Date.now(),
    receivedAt: Date.now(),
  };

  recentBotEvents.unshift(stored);
  if (recentBotEvents.length > MAX_EVENTS) recentBotEvents.length = MAX_EVENTS;

  sendJson(res, 200, { ok: true, receivedAt: stored.receivedAt, event: stored });
}
