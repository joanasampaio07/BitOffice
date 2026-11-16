# BitOffice

Escritório virtual em pixel art que mostra, em tempo real, o que seus agentes de IA estão fazendo.

## Como rodar localmente

```bash
npm install
npm run dev:client
```

Para visualizar com dados simulados no navegador, acesse:

```
http://localhost:5173/?mock=1
```

## Scripts principais

- `npm run dev` — inicia servidor e cliente em modo de desenvolvimento
- `npm run dev:client` — inicia apenas o cliente Vite (`?mock=1` para simulação)
- `npm run demo` — inicia o servidor com dados de demonstração (`HABBLAUD_DEMO=1`)
- `npm run build` — gera o build de produção (`client` e `server`)
- `npm test` — executa os testes com Vitest
