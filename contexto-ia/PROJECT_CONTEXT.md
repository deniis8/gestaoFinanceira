# 📋 Contexto do Projeto - Gestão Financeira

**Última atualização:** 2026-09-13

## 🎯 Visão Geral

**Gestão Financeira** é um sistema web de controle de receitas e despesas, categorizado por centros de custo. Desenvolvido em **Angular 19** com integração a um backend REST API. O aplicativo permite que usuários gerenciem sua vida financeira pessoal ou empresarial através de uma interface moderna e responsiva.

### Objetivo Principal
Fornecer uma plataforma intuitiva para:
- Registrar receitas e despesas
- Categorizar lançamentos por centros de custo
- Visualizar análises e gráficos financeiros
- Gerenciar lançamentos fixos (receitas/despesas recorrentes)
- Obter análises com IA

---

## 🛠️ Stack Tecnológico

### Core Framework
- **Angular**: v19.2.0 (Framework principal)
- **TypeScript**: ~5.8.2 (Linguagem)
- **RxJS**: ~7.8.0 (Programação reativa)

### UI & Estilo
- **Angular Material**: v19.2.1 (Componentes Material Design)
- **Bootstrap**: v5.3.5 (Framework CSS)
- **Bootstrap Icons**: v1.11.3 (Iconografia)

### Visualização de Dados
- **Chart.js**: v3.9.1 (Biblioteca de gráficos)
- **ng2-charts**: v4.1.1 (Wrapper Angular para Chart.js)
- **chartjs-plugin-datalabels**: v2.2.0 (Plugin para labels em gráficos)

### Utilities
- **Moment.js**: v2.29.4 (Manipulação de datas)
- **SweetAlert2**: v11.17.2 (Modais e alertas)
- **ngx-skeleton-loader**: v11.3.0 (Carregamento skeleton)

### Testes & Qualidade
- **Playwright**: v1.63.0 (E2E testing)
- **Jasmine**: ~4.5.0 (Unit testing framework)
- **Karma**: ~6.4.0 (Test runner)

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── pages/                    # Páginas/rotas principais
│   │   ├── home/                 # Dashboard inicial
│   │   ├── graficos/             # Gráficos e análises financeiras
│   │   ├── lancamentos/          # Gestão de lançamentos (receitas/despesas)
│   │   ├── lancamento-fixo/      # Gestão de lançamentos recorrentes
│   │   ├── centro-custo/         # Gestão de centros de custo
│   │   ├── configuracoes-ia/     # Configurações de IA e análises
│   │   └── login/                # Autenticação
│   ├── components/               # Componentes reutilizáveis
│   │   ├── lancamento-form/      # Formulário para lançamentos
│   │   ├── lancamento-fixo-form/ # Formulário para lançamentos fixos
│   │   ├── centro-custo-form/    # Formulário para centros de custo
│   │   ├── tabela-lancamento/    # Tabela de lançamentos
│   │   ├── donut-chart/          # Gráfico de rosca
│   │   ├── saldos/               # Exibição de saldos
│   │   ├── pop-up-centro-custo/  # Modal para centro de custo
│   │   ├── pop-up-ia/            # Modal para análises IA
│   │   ├── copiar-lancamentos/   # Feature de cópia de lançamentos
│   │   └── footer/               # Rodapé da aplicação
│   ├── services/                 # Serviços (lógica de negócio)
│   │   ├── lancamento/           # Serviço CRUD de lançamentos
│   │   ├── lancamento-fixo/      # Serviço CRUD de lançamentos fixos
│   │   ├── cetro-custo/          # Serviço CRUD de centros de custo
│   │   ├── saldo/                # Serviço de saldos
│   │   ├── gastos-mensais/       # Serviço de gastos mensais
│   │   ├── gastos-centro-custo/  # Serviço de gastos por centro
│   │   ├── detalhamento-gastos-custo/ # Serviço de detalhamento
│   │   ├── configuracoes-ia/     # Serviço de configurações IA
│   │   ├── login/                # Serviço de autenticação
│   │   ├── mensagens/            # Serviço de notificações
│   │   └── interceptor/          # Interceptor HTTP (auth + token refresh)
│   ├── pipes/                    # Pipes customizados
│   │   └── format-valor.pipe.ts  # Formatação de valores monetários
│   ├── utils/                    # Funções utilitárias
│   │   └── colors.ts             # Paleta de cores para gráficos
│   ├── app.module.ts             # Módulo raiz
│   ├── app-routing.module.ts     # Rotas da aplicação
│   ├── app.component.ts          # Componente raiz
│   └── types.ts                  # Interfaces TypeScript
├── main.ts                       # Entrada principal
├── styles.css                    # Estilos globais
└── types.ts                      # Tipos globais

e2e/
└── example.spec.ts              # Testes E2E com Playwright

tests/                            # Resultados de testes

```

---

## 🧩 Modelos de Dados Principais

### `Saldo`
Representa o saldo financeiro do usuário em um período.
```typescript
{
  id?: number;
  saldo: number;                    // Saldo total
  investimentoFixo: number;         // Investimento em ativo fixo
  investimentoVariavel: number;     // Investimento em ativo variável
  gastosMesAtual: number;           // Gastos do mês atual
  receitaMesAtual: number;          // Receita do mês atual
  dataHora: Date;
  idUsuario: number;
}
```

### `Lancamento`
Representa uma transação financeira (receita ou despesa).
```typescript
{
  id?: number;
  dataHora: Date;
  valor: number;
  descricao: string;
  status: string;
  idCCusto: number;                 // ID do centro de custo
  descriCCusto?: string;            // Descrição do centro de custo
  idUsuario: number;
  deletado?: string;                // Flag para soft delete
}
```

### `LancamentoFixo`
Representa uma transação recorrente (mensal, por exemplo).
```typescript
{
  id?: number;
  diaMes: number;                   // Dia do mês para ocorrência
  valor: number;
  descricao: string;
  status: string;
  idCCusto: number;
  descriCCusto?: string;
  idUsuario: number;
  deletado?: string;
}
```

### `CentroCusto`
Categoria para organizar lançamentos.
```typescript
{
  id?: number;
  descriCCusto?: string;
  deletado?: string;
  valorLimite: number;              // Limite de gastos
}
```

### `GastosMensais`
Agregação de gastos por mês.
```typescript
{
  valor: number;
  ano: number;
  mes: string;
  sobraMes: number;                 // Saldo sobrado no mês
  valorRecebidoMes: number;         // Total recebido
  idUsuario: number;
}
```

### `ConfiguracoesIA`
Configurações para análises de IA.
```typescript
{
  id?: number;
  filtroDataDe: Date;
  filtroDataAte: Date;
  prompt: string;                   // Prompt customizado para IA
  idUsuario: number;
}
```

---

## 📄 Rotas Principais

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/login` | LoginComponent | Tela de autenticação |
| `/home` | HomeComponent | Dashboard principal |
| `/graficos` | GraficosComponent | Gráficos e análises |
| `/lancamento/novo` | NovoLancamentoComponent | Criar lançamento |
| `/lancamento/edit/:id` | EditLancamentoComponent | Editar lançamento |
| `/lancamento/excluir/:id` | ExcluirLancamentoComponent | Deletar lançamento |
| `/lancamento-fixo` | TabelaLancamentoFixoComponent | Lista de lançamentos fixos |
| `/lancamento-fixo/novo` | NovoLancamentoFixoComponent | Criar lançamento fixo |
| `/lancamento-fixo/edit/:id` | EditLancamentoFixoComponent | Editar lançamento fixo |
| `/lancamento-fixo/excluir/:id` | ExcluirLancamentoFixoComponent | Deletar lançamento fixo |
| `/centro-custo` | TabelaCentroCustoComponent | Lista de centros de custo |
| `/centro-custo/novo` | NovoCentroCustoComponent | Criar centro de custo |
| `/centro-custo/edit/:id` | EditCentroCustoComponent | Editar centro de custo |
| `/centro-custo/excluir/:id` | ExcluirCentroCustoComponent | Deletar centro de custo |
| `/configuracoes-ia` | ConfiguracoesIaComponent | Configurar análises com IA |

---

## 🔑 Serviços Principais

### `LoginService`
Gerencia autenticação e tokens.
- `postLogin()` - Realiza login
- `storeTokens()` - Armazena auth token (sessionStorage) e refresh token (localStorage)
- `getAuthToken()` - Obtém token de autenticação
- `getIdUsuario()` - Obtém ID do usuário logado
- `getRefreshToken()` - Obtém refresh token
- `refreshToken()` - Renova o token de autenticação

### `AuthInterceptor`
Interceptor HTTP que:
- Adiciona token de autenticação em todas as requisições
- Trata erros 401 (Unauthorized)
- Implementa refresh token automático quando token expira
- Exibe mensagens de erro para outras falhas HTTP

### `LancamentoService`
CRUD completo para lançamentos.
- Criar, ler, atualizar, deletar lançamentos
- Integra com backend REST API

### `LancamentoFixoService`
CRUD para lançamentos fixos/recorrentes.

### `CentroCustoService` (note: nome com typo "cetro")
CRUD para centros de custo.

### `SaldoService`
Recupera informações de saldo do usuário.

### `GastosMensaisService`
Obtém agregações de gastos por mês.

### `GastosCentroCustoService`
Analisa gastos agrupados por centro de custo.

### `ConfiguracoesIaService`
Gerencia configurações para análises com IA.

### `MensagensService`
Serviço centralizado de notificações (SweetAlert2).

---

## 🎨 Componentes Principais

### Componentes de Formulário
- **LancamentoFormComponent** - Formulário compartilhado para criar/editar lançamentos
- **LancamentoFixoFormComponent** - Formulário para lançamentos recorrentes
- **CentroCustoFormComponent** - Formulário para centros de custo

### Componentes de Visualização
- **TabelaLancamentoComponent** - Tabela com lista de lançamentos
- **DonutChartComponent** - Gráfico tipo rosca para distribuição de gastos
- **SaldosComponent** - Exibição de saldos (atual, fixo, variável)

### Componentes Utilitários
- **PopUpCentroCustoComponent** - Modal para seleção/criação de centro de custo
- **PopUpIaComponent** - Modal para análises com IA
- **CopiarLancamentosComponent** - Feature para copiar lançamentos entre meses
- **FooterComponent** - Rodapé da aplicação

---

## 🔐 Segurança & Autenticação

### Fluxo de Autenticação
1. Usuário faz login com email/senha
2. Backend retorna `authToken` (sessão) e `refreshToken` (persistente)
3. `authToken` é armazenado em `sessionStorage` (limpa ao fechar aba)
4. `refreshToken` é armazenado em `localStorage` (persiste entre abas)
5. O `AuthInterceptor` adiciona o token em todas as requisições
6. Quando token expira (erro 401), o interceptor chama `refreshToken()`

### Armazenamento
```typescript
sessionStorage.setItem('authToken', token);      // Sessão
localStorage.setItem('refreshToken', token);     // Persistente
localStorage.setItem('idUsuario', idUsuario);    // ID do usuário
```

---

## 📊 Pipe Customizado

### `FormatValorPipe`
Formata valores monetários no padrão brasileiro (R$ 1.234,56).
Uso: `{{ valor | formatValor }}`

---

## 🧪 Testes

### E2E Tests (Playwright)
- Localizado em: `e2e/example.spec.ts`
- Cobre fluxo completo do aplicativo
- Testes de navegação, login, CRUD de lançamentos, gráficos, centros de custo, etc.

### Unit Tests
- Framework: Jasmine
- Test Runner: Karma
- Padrão: Arquivo `.spec.ts` ao lado de cada componente/serviço

---

## 🚀 Comandos Principais

```bash
npm start          # Inicia servidor de desenvolvimento (localhost:4200)
npm run build      # Build para produção
npm run watch      # Build em modo watch
npm test           # Executa testes unitários
```

---

## 📡 Integração com Backend

### Base URL
Configurada em: `src/environments/environment.ts`
```typescript
export const environment = {
  baseApiUrl: 'http://seu-backend.com/'
};
```

### Endpoints Utilizados (Padrão RESTful)
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET/POST/PUT/DELETE /api/lancamento` - Lançamentos
- `GET/POST/PUT/DELETE /api/lancamento-fixo` - Lançamentos fixos
- `GET/POST/PUT/DELETE /api/centro-custo` - Centros de custo
- `GET /api/saldo` - Saldos
- `GET /api/gastos-mensais` - Gastos mensais
- `GET /api/gastos-centro-custo` - Gastos por centro
- `GET /api/configuracoes-ia` - Configurações IA

---

## 🎯 Funcionalidades Principais

### 1. Gestão de Lançamentos
- ✅ CRUD completo (Criar, Ler, Atualizar, Deletar)
- ✅ Filtro por centro de custo
- ✅ Validação de campos obrigatórios
- ✅ Soft delete (lançamentos marcados como deletado)
- ✅ Cópia de lançamentos entre períodos

### 2. Lançamentos Fixos/Recorrentes
- ✅ Agendamento de lançamentos (dia do mês)
- ✅ Aplicação automática em vários períodos
- ✅ Edição e exclusão

### 3. Centros de Custo
- ✅ Categorização de despesas
- ✅ Definição de limite de gasto por centro
- ✅ Visualização de gasto total por centro

### 4. Análises Financeiras
- ✅ Gráficos de distribuição (donut charts)
- ✅ Gráficos de evolução mensal
- ✅ Análise de saldo

### 5. Integração com IA
- ✅ Configurações customizáveis por usuário
- ✅ Prompts personalizados
- ✅ Filtros de data para análises

### 6. Segurança
- ✅ Autenticação com JWT
- ✅ Refresh token automático
- ✅ Interceptor HTTP para gerenciar tokens

---

## 📝 Convenções & Padrões

### Nomenclatura
- **Componentes**: PascalCase (ex: `LancamentoFormComponent`)
- **Services**: nome + `Service` (ex: `LancamentoService`)
- **Pipes**: nome + `Pipe` (ex: `FormatValorPipe`)
- **Interfaces**: PascalCase, sem prefixo (ex: `Lancamento`, `Saldo`)
- **Arquivos**: kebab-case (ex: `lancamento-form.component.ts`)

### Estrutura de Componente
Cada componente possui:
- `.component.ts` - Lógica
- `.component.html` - Template
- `.component.css` - Estilos
- `.component.spec.ts` - Testes

### Response API
Todos os endpoints retornam:
```typescript
interface Response<T> {
  message?: string;
  data: T;
}
```

---

## ⚠️ Observações Importantes

1. **Typo no nome**: Há um typo no diretório `cetro-custo` (deveria ser `centro-custo`)
2. **Tokens**: Auth token em sessão (limpa ao fechar aba), refresh token persistente
3. **Soft Delete**: Lançamentos/centros não são deletados fisicamente, apenas marcados como `deletado`
4. **Responsividade**: Usa Bootstrap + Angular Material para layout responsivo
5. **Loading States**: Implementado com `ngx-skeleton-loader`

---

## 🔄 Fluxo de Desenvolvimento Recomendado

1. **Criar nova feature**: Criar página ou componente
2. **Implementar serviço**: Criar serviço com lógica de API
3. **Criar template**: Adicionar HTML com formulários/tabelas
4. **Adicionar testes**: Criar testes unitários
5. **Testar E2E**: Adicionar teste no Playwright
6. **Documentar**: Atualizar este contexto se necessário

---

## 📞 Próximos Passos para Desenvolvimento

- [ ] Implementar guards de autenticação nas rotas
- [ ] Adicionar testes unitários mais completos
- [ ] Melhorar mensagens de erro
- [ ] Implementar cache de dados
- [ ] Adicionar paginação em tabelas grandes
- [ ] Melhorar responsividade mobile

