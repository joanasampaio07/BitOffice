# Guia Completo: Registro no INPI, Arquitetura e Segurança para Prefeituras (BitOffice + MSBot)

Este documento reúne o passo a passo técnico, jurídico (INPI) e de segurança cibernética (**CIS Controls v8**, **NIST CSF** e **LGPD**) para implantar e comercializar o **BitOffice + MSBot** em prefeituras.

---

## 1. Onde instalar e como disponibilizar?

### Comparativo: Servidor da Prefeitura vs. Seu Servidor (Nuvem)

| Critério | On-Premise (Servidor da Prefeitura) | Nuvem Dedicada (Seu Servidor / VPS Isolada por Município) |
| :--- | :--- | :--- |
| **Controle dos dados (LGPD)** | Os dados nunca saem da rede da prefeitura (excelente para licitações). | Exige contrato claro de operador de dados (LGPD) e servidor no Brasil (ex.: São Paulo). |
| **Manutenção e atualizações** | Mais difícil (depende de VPN ou equipe local da prefeitura). | Muito mais fácil (você gerencia tudo remotamente). |
| **Segurança contra invasão** | Fica atrás do firewall da prefeitura, mas exige hardening local. | Você controla 100% do firewall, HTTPS, backups e monitoramento. |
| **Recomendação** | Ideal quando o edital exige dados 100% internos. | **Ideal para vender como SaaS** (1 container/VPS isolada por prefeitura). |

### Web ou App?
- **Recomendação:** **Web (HTTPS) + PWA (Instalável no celular/desktop)**.
- **Por quê:** Prefeituras usam computadores variados (Windows/Linux) com restrição de instalação de `.exe`/apps. Um sistema Web com HTTPS funciona direto no navegador e pode ser fixado como app na tela inicial sem passar por loja de aplicativos.

---

## 2. Registro no INPI (Programa de Computador)

Para vender para prefeituras com segurança jurídica e exclusividade, registre o software no **INPI**:

1. **Prepare o código-fonte:**
   - Gere um arquivo `.zip` com o código-fonte do **BitOffice** e do **MSBot** (sem `node_modules`).
2. **Gere o Hash SHA-512 (obrigatório no INPI):**
   - No PowerShell:
     ```powershell
     Get-FileHash .\BitOffice-MSBot.zip -Algorithm SHA512
     ```
   - Guarde esse código hash e **nunca altere** o `.zip` original (ele é a prova de autoria).
3. **Documentação técnica para o pedido:**
   - Nome do programa: **BitOffice** (ou **BitOffice + MSBot**).
   - Linguagens: TypeScript, Node.js, HTML5, CSS3.
   - Campo de aplicação: Administração Pública / Automação de Processos.
   - Resumo funcional: Sistema de monitoramento visual em tempo real e orquestração de robôs de atendimento e processos administrativos.
4. **Protocolo no portal e-INPI:**
   - Acesse o portal do INPI, pague a GRU (taxa de registro de programa de computador), envie os dados e o hash SHA-512. O certificado sai normalmente em poucos dias.

---

## 3. Passo a Passo de Instalação Segura (Anti-Invasão)

### Fase 1: Preparação do Servidor (CIS Controls 1, 2, 4)
1. **Sistema Operacional:** Use Ubuntu Server LTS atualizado.
2. **Atualizações automáticas de segurança:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y unattended-upgrades fail2ban ufw
   ```
3. **Acesso SSH seguro:**
   - Desabilite login por senha (`PasswordAuthentication no`) e login de `root` (`PermitRootLogin no`).
   - Use apenas **chave SSH** e ative o **Fail2Ban** contra força bruta.

### Fase 2: Firewall e Rede (CIS Controls 12, 13 / NIST PR.AC)
1. **Bloqueie todas as portas**, liberando apenas o necessário:
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp    # SSH (restrito ao seu IP ou VPN)
   sudo ufw allow 80/tcp    # Redireciona para HTTPS
   sudo ufw allow 443/tcp   # HTTPS público/interno
   sudo ufw enable
   ```
2. **Nunca exponha a porta `4747` ou banco de dados diretamente na internet.**
   - Use um **Proxy Reverso** (Nginx ou Caddy) na porta `443` com certificado **TLS/SSL (HTTPS)** válido.

### Fase 3: Isolamento da Aplicação com Docker (CIS Control 4)
1. Suba o **BitOffice + MSBot** usando `docker-compose.prefeitura.yml`:
   ```bash
   docker compose -f docker-compose.prefeitura.yml up -d --build
   ```
2. **Isolamento por Prefeitura:** Nunca misture dados de duas prefeituras no mesmo banco ou container. Cada município deve ter sua própria instância isolada.

### Fase 4: Autenticação, Permissões e LGPD (CIS Controls 5, 6 / NIST PR.AC)
1. **Autenticação obrigatória:** Todo acesso ao painel deve exigir login e senha forte (com hash `bcrypt`/`argon2`) e, preferencialmente, **2FA (Autenticação em dois fatores)** para administradores.
2. **RBAC (Controle de Acesso por Setor):**
   - Servidor da Saúde vê apenas a sala *Saúde*.
   - Prefeito/Controladoria vê o painel geral.
3. **Token de API no `/api/bot-events`:**
   - Exija um cabeçalho `Authorization: Bearer <TOKEN_SECRETO>` para que apenas o `msbot` autorizado consiga enviar eventos ao BitOffice.

### Fase 5: Auditoria, Logs e Backup (CIS Controls 8, 11 / NIST DE.AE, PR.IP)
1. **Logs Imutáveis (Auditoria):**
   - Registre em banco de dados: `data/hora`, `usuário/bot`, `setor`, `ação executada`, `IP de origem` e `resultado`.
   - Prefeituras e Tribunais de Contas exigem rastreabilidade completa.
2. **Política de Backup 3-2-1-1-0:**
   - **3** cópias dos dados.
   - Em **2** mídias diferentes.
   - **1** cópia fora do servidor (*off-site*, ex.: bucket S3 criptografado).
   - **1** cópia **imutável / offline** (*air-gapped* / *Object Lock*, protegida contra ransomware).
   - **0** erros verificados em testes periódicos de restauração.

---

## 4. Checklist Rápido antes de Entregar para a Prefeitura

- [ ] Código-fonte empacotado e registrado no **INPI** (Hash SHA-512 guardado).
- [ ] Servidor com **HTTPS (TLS 1.2/1.3)** ativo e porta `4747` fechada para acesso externo direto.
- [ ] **Firewall (UFW)** e **Fail2Ban** ativos.
- [ ] Login com senha forte e **controle de acesso por setor**.
- [ ] **Logs de auditoria** e **backup automático diário (3-2-1-1-0)** configurados.
- [ ] Termo de **LGPD** e contrato de licenciamento/suporte assinados.
