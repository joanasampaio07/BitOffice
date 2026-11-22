# Documento 1: Dossiê Técnico para Registro no INPI

Este documento contém todas as informações técnicas necessárias para preencher o formulário de **Registro de Programa de Computador** no portal **e-INPI**.

---

## 1. Dados Básicos do Programa
- **Título do Programa:** BitOffice (ou *BitOffice — Plataforma de Orquestração e Monitoramento de Agentes*)
- **Tipo de Programa:** Aplicativo / Sistema Corporativo e Governamental
- **Linguagens de Programação:** TypeScript, JavaScript (Node.js), HTML5, CSS3
- **Campo de Aplicação:** Administração Pública, Automação de Processos, Monitoramento em Tempo Real
- **Data de Criação:** 2026

---

## 2. Resumo Funcional (para colar no formulário do INPI)
> O **BitOffice** é uma plataforma web de monitoramento visual em tempo real e orquestração de robôs de automação (**MSBot**) voltada para setores administrativos e órgãos públicos. O sistema organiza processos em salas virtuais por departamento (como Protocolo, Licitações, Saúde e Atendimento), exibindo o status de execução de cada agente, filas de tarefas, feed de atividades, histórico de auditoria e fluxo de aprovação humana (*human-in-the-loop*) antes da conclusão de ações críticas.

---

## 3. Arquitetura Técnica
1. **Frontend (`client/`):** Interface web responsiva em TypeScript + Vite + Canvas/Pixel Art, com suporte a modo PWA (instalável no navegador).
2. **Backend (`server/`):** Servidor Node.js com API REST (`/api/bot-events`, `/api/snapshot`, `/api/health`) e streaming em tempo real via Server-Sent Events (`/api/stream`).
3. **Conector de Automação (`OpenMausBot / msbot`):** Módulo em TypeScript (`bitoffice-connector.ts`) que envia eventos de execução dos processos para o painel central.
4. **Infraestrutura:** Empacotamento em containers Docker (`docker-compose.prefeitura.yml`) com isolamento por município.

---

## 4. Como gerar o pacote `.zip` e o Hash SHA-512 (Obrigatório no INPI)

O INPI **não** recebe o código-fonte diretamente; ele exige o **Resumo Digital Hash (SHA-512)** gerado a partir do arquivo compactado do código-fonte.

1. **Compacte o código-fonte** (sem `node_modules` e sem `.git`):
   ```powershell
   Compress-Archive -Path .\client, .\server, .\shared, .\package.json, .\tsconfig.json, .\vite.config.ts -DestinationPath .\BitOffice-INPI.zip -Force
   ```
2. **Gere o Hash SHA-512:**
   ```powershell
   Get-FileHash .\BitOffice-INPI.zip -Algorithm SHA512
   ```
3. **Guarde o arquivo `BitOffice-INPI.zip` em local seguro (nuvem + HD externo):**
   - **Nunca altere** esse `.zip` após o registro, pois ele é a prova jurídica de autoria caso haja disputa.

---

## 5. Checklist do Protocolo no e-INPI
- [ ] Emitir e pagar a **GRU** (Guia de Recolhimento da União) no portal do INPI.
- [ ] Preencher o formulário eletrônico com os dados da Seção 1 e 2.
- [ ] Inserir o **Hash SHA-512** gerado na Seção 4.
- [ ] Enviar o pedido e aguardar a emissão do Certificado de Registro.
