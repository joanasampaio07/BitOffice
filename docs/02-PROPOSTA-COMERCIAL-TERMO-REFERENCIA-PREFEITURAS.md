# Documento 2: Proposta Comercial e Termo de Referência — BitOffice + MSBot para Prefeituras

Este modelo serve tanto para apresentação comercial (prefeitos, secretários e TI) quanto como base técnica para **Termo de Referência** em processos de contratação pública.

---

## 1. Objeto
Contratação de licença de uso de software (SaaS isolado ou *On-Premise*) da plataforma **BitOffice + MSBot**, destinada ao monitoramento visual em tempo real, orquestração e auditoria de robôs de automação de processos administrativos municipais.

---

## 2. Problemas que o Sistema Resolve na Prefeitura
- **Filas e gargalos invisíveis:** Gestores não conseguem acompanhar em tempo real o andamento de processos digitais entre secretarias.
- **Retrabalho operacional:** Servidores gastam horas em triagem manual de protocolos, conferência de documentos e respostas repetitivas.
- **Falta de rastreabilidade:** Dificuldade para auditar quem executou cada etapa de um processo.

---

## 3. Funcionalidades Entregues
1. **Escritório Virtual por Secretaria/Setor:**
   - Salas separadas por departamento (*Protocolo*, *Licitações*, *Tributos*, *Saúde*, *RH*, *Atendimento*).
   - Visualização em tempo real do status de cada robô (**trabalhando**, **aguardando aprovação**, **concluído**, **erro**).
2. **Aprovação Humana (*Human-in-the-Loop*):**
   - Em decisões sensíveis, o robô pausa e solicita aprovação de um servidor autorizado antes de concluir a ação.
3. **Feed de Atividades e Auditoria:**
   - Registro cronológico de todas as tarefas executadas, com data/hora, setor e resultado.
4. **Acesso Web (HTTPS) + PWA:**
   - Funciona direto no navegador (computador ou celular) sem necessidade de instalar programas nas máquinas da prefeitura.

---

## 4. Requisitos Técnicos e Segurança (Resumo para Edital)
- **Arquitetura:** Aplicação Web em HTTPS (TLS 1.2/1.3) empacotada em containers Docker isolados por município.
- **Conformidade:** Alinhado às diretrizes **CIS Controls v8**, **NIST CSF** e **LGPD** (Lei nº 13.709/2018).
- **Backup:** Política **3-2-1-1-0** (3 cópias, 2 mídias, 1 externa, 1 imutável/offline, 0 erros na verificação).
- **Propriedade Intelectual:** Software registrado no **INPI**.

---

## 5. Modelo de Implantação e Suporte (SLA)
- **Implantação inicial:** Configuração do ambiente isolado, criação das salas/setores e treinamento da equipe de TI e servidores.
- **Suporte técnico:** Atendimento remoto em horário comercial, atualizações de segurança contínuas e monitoramento de disponibilidade.
- **Modelo de cobrança sugerido:**
  - Taxa única de **Implantação + Treinamento**
  - **Mensalidade (SaaS)** por município ou por pacote de robôs/setores ativos.
