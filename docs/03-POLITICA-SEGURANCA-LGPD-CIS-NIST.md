# Documento 3: Política de Segurança da Informação e LGPD — BitOffice + MSBot

Este documento formaliza os controles de segurança cibernética e privacidade adotados pela plataforma **BitOffice + MSBot** para atendimento a órgãos públicos, em conformidade com **CIS Controls v8**, **NIST Cybersecurity Framework (CSF)** e **LGPD (Lei nº 13.709/2018)**.

---

## 1. Matriz de Controles (CIS Controls v8 & NIST CSF)

| Domínio | Controle Aplicado | Referência |
| :--- | :--- | :--- |
| **Identidade e Acesso** | Autenticação obrigatória com senha forte (`argon2`/`bcrypt`), 2FA para administradores e RBAC por secretaria/setor. | CIS 5, 6 / NIST PR.AC |
| **Segurança de Rede** | Firewall (`ufw`) com bloqueio padrão de entrada, apenas portas `80/443` via Proxy Reverso e SSH restrito por chave + `fail2ban`. | CIS 12, 13 / NIST PR.AC |
| **Criptografia em Trânsito** | Todo tráfego Web e API protegido por **HTTPS (TLS 1.2 / 1.3)**; portas internas (`4747`) nunca expostas diretamente. | CIS 3 / NIST PR.DS |
| **Isolamento de Ambiente** | Containers Docker dedicados e isolados por município (*single-tenant*), evitando vazamento entre prefeituras. | CIS 4 / NIST PR.IP |
| **Proteção de API** | Endpoint `/api/bot-events` protegido por token Bearer secreto e validação estrita de payload JSON (máx. 64 KB). | CIS 16 / NIST PR.DS |
| **Auditoria e Logs** | Registro imutável de ações (data/hora, bot/usuário, setor, tarefa, IP e resultado) para rastreabilidade e Tribunais de Contas. | CIS 8 / NIST DE.AE |
| **Gestão de Vulnerabilidades** | Atualizações automáticas de segurança do SO (`unattended-upgrades`) e revisão periódica de dependências. | CIS 7 / NIST ID.RA |

---

## 2. Política de Backup e Continuidade (Regra 3-2-1-1-0)

Para garantir resiliência contra falhas de hardware, exclusão acidental e ataques de **ransomware**:

- **3** cópias dos dados (produção + 2 backups).
- **2** mídias ou tecnologias de armazenamento diferentes.
- **1** cópia fora do servidor principal (*off-site*, em nuvem criptografada no Brasil).
- **1** cópia **imutável / offline** (*air-gapped* ou *Object Lock*, que não pode ser apagada ou criptografada por invasores).
- **0** erros verificados em testes mensais de restauração.

---

## 3. Conformidade com a LGPD (Lei nº 13.709/2018)

1. **Papéis:** A Prefeitura atua como **Controladora** dos dados; a empresa fornecedora atua como **Operadora**, tratando os dados exclusivamente conforme instrução do município.
2. **Minimização de Dados:** O painel visual do BitOffice exibe apenas metadados operacionais (setor, status do robô e título da tarefa), evitando exposição desnecessária de dados pessoais sensíveis de cidadãos.
3. **Retenção e Descarte:** Ao término do contrato, todos os dados e backups da prefeitura são exportados em formato padrão e eliminados de forma segura após confirmação formal.

---

## 4. Plano de Resposta a Incidentes (NIST RS)
1. **Detecção:** Alertas de tentativas de invasão (`fail2ban`), erro de integridade ou pico anômalo de requisições.
2. **Contenção:** Isolamento imediato do container/IP suspeito e revogação de tokens comprometidos.
3. **Recuperação:** Restauração limpa a partir da cópia imutável (**3-2-1-1-0**).
4. **Comunicação:** Notificação formal ao Encarregado de Dados (DPO) da Prefeitura dentro do prazo legal da LGPD.
