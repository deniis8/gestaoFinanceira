# 🧪 Suite de Testes E2E - Playwright

Documentação completa dos testes E2E para a aplicação Gestão Financeira.

## 📋 Estrutura de Testes

```
tests/
├── fixtures/
│   └── auth.ts              # Fixtures e helpers reutilizáveis
├── specs/
│   ├── 01-auth.spec.ts      # Testes de autenticação
│   ├── 02-lancamentos.spec.ts     # CRUD de lançamentos
│   ├── 03-centros-custo.spec.ts   # CRUD de centros de custo
│   ├── 04-lancamentos-fixos.spec.ts # CRUD de lançamentos fixos
│   ├── 05-graficos.spec.ts  # Testes de gráficos e análises
│   ├── 06-configuracoes-ia.spec.ts # Testes de configurações IA
│   └── 07-fluxo-completo.spec.ts  # Fluxos completos de E2E
└── README.md                # Este arquivo
```

## 🚀 Como Executar os Testes

### Pré-requisitos
- Node.js instalado
- Angular dev server rodando em `http://localhost:4200`
- Backend API disponível

### 1. Instalação de Dependências
```bash
npm install
```

### 2. Iniciar o Servidor Angular
Em um terminal:
```bash
npm start
```

O servidor iniciará em `http://localhost:4200`

### 3. Executar os Testes

#### Executar todos os testes
```bash
npx playwright test
```

#### Executar testes de um arquivo específico
```bash
npx playwright test tests/specs/01-auth.spec.ts
npx playwright test tests/specs/02-lancamentos.spec.ts
```

#### Executar testes com um padrão
```bash
# Testes de autenticação
npx playwright test 01-auth

# Testes de CRUD
npx playwright test lancamentos
```

#### Modo UI (interativo)
```bash
npx playwright test --ui
```

#### Modo Debug
```bash
npx playwright test --debug
```

#### Executar em modo headed (ver navegador)
```bash
npx playwright test --headed
```

#### Executar um teste específico
```bash
npx playwright test -g "Deve fazer login com credenciais válidas"
```

## 📊 Visualizar Relatório

Após executar os testes, gere o relatório HTML:
```bash
npx playwright show-report
```

O relatório abrirá em seu navegador padrão mostrando:
- Testes passou/falhados
- Screenshots dos testes
- Traces de execução
- Detalhes de cada teste

## 🏗️ Estrutura dos Testes

### Fixtures e Helpers (`tests/fixtures/auth.ts`)

#### `AuthFixture`
```typescript
- login(email, senha) // Faz login
- logout() // Faz logout
- isAuthenticated() // Verifica se está autenticado
- isOnLoginPage() // Verifica se está na página de login
```

#### `NavigationHelper`
```typescript
- navigateTo(menuName) // Navega para uma seção
- waitForPageLoad() // Aguarda carregamento
- goHome() // Volta para home
```

#### `FormHelper`
```typescript
- fillTextField(label, value) // Preenche campo de texto
- selectOption(label, value) // Seleciona opção em dropdown
- clickButton(buttonName) // Clica em botão
- hasErrorMessage(message) // Verifica se há erro
- waitForAlert() // Aguarda alerta SweetAlert
- confirmAlert() // Confirma alerta
```

#### `AssertionHelper`
```typescript
- isVisible(value) // Verifica se valor está visível
- tableContains(value) // Verifica se tabela contém valor
- getTableRowCount() // Conta linhas da tabela
```

## 📝 Testes por Funcionalidade

### 1. Autenticação (01-auth.spec.ts) - 8 testes
- ✅ Login com credenciais válidas
- ✅ Erro com email vazio
- ✅ Erro com senha vazia
- ✅ Logout correto
- ✅ Manutenção de sessão ao recarregar
- ✅ Limpeza de sessão ao logout
- ✅ Validação de formato de email
- ✅ Campos obrigatórios

### 2. Lançamentos (02-lancamentos.spec.ts) - 12 testes
- ✅ Navegação para página de lançamentos
- ✅ Criar lançamento de despesa
- ✅ Criar lançamento de receita
- ✅ Validar valor obrigatório
- ✅ Validar descrição obrigatória
- ✅ Listar lançamentos
- ✅ Editar lançamento
- ✅ Deletar lançamento
- ✅ Validar valores negativos
- ✅ Formatar valores com centavos
- ✅ Filtro por centro de custo
- ✅ Filtro por data

### 3. Centros de Custo (03-centros-custo.spec.ts) - 12 testes
- ✅ Navegação para centros de custo
- ✅ Criar novo centro de custo
- ✅ Validar descrição obrigatória
- ✅ Listar centros de custo
- ✅ Editar centro de custo
- ✅ Deletar centro de custo
- ✅ Validar limite como número positivo
- ✅ Permitir limite zero
- ✅ Aviso de gasto acima do limite
- ✅ Filtrar por descrição
- ✅ Botões de ações
- ✅ Impedir deleção com lançamentos

### 4. Lançamentos Fixos (04-lancamentos-fixos.spec.ts) - 12 testes
- ✅ Navegação para lançamentos fixos
- ✅ Criar lançamento fixo de despesa
- ✅ Criar lançamento fixo de receita
- ✅ Validar dia do mês (1-31)
- ✅ Validar dia não pode ser 0
- ✅ Validar valor obrigatório
- ✅ Validar descrição obrigatória
- ✅ Listar lançamentos fixos
- ✅ Editar lançamento fixo
- ✅ Deletar lançamento fixo
- ✅ Validar dia do mês obrigatório
- ✅ Status ativo/inativo

### 5. Gráficos (05-graficos.spec.ts) - 13 testes
- ✅ Navegação para gráficos
- ✅ Exibição de gráfico donut
- ✅ Exibição de saldos
- ✅ Filtro por período
- ✅ Gráfico de evolução mensal
- ✅ Labels de meses e valores
- ✅ Formatação em reais (R$)
- ✅ Legenda/tooltip em gráficos
- ✅ Saldo investimento (fixo e variável)
- ✅ Filtro por centro de custo
- ✅ Atualização ao mudar filtro
- ✅ Loading skeleton
- ✅ Mensagem sem dados

### 6. Configurações IA (06-configuracoes-ia.spec.ts) - 15 testes
- ✅ Navegação para configurações IA
- ✅ Formulário de configuração
- ✅ Campo data inicial
- ✅ Campo data final
- ✅ Campo prompt customizado
- ✅ Botão de análise
- ✅ Salvar configurações
- ✅ Validar data inicial < data final
- ✅ Período predefinido 30 dias
- ✅ Período predefinido 90 dias
- ✅ Período personalizado
- ✅ Resultado da análise
- ✅ Limpar configurações
- ✅ Histórico de análises
- ✅ Loading indicador

### 7. Fluxo Completo (07-fluxo-completo.spec.ts) - 9 testes
- ✅ Login → Centro de Custo → Lançamento → Gráficos → Logout
- ✅ Criar → Editar → Deletar Lançamento Fixo
- ✅ Navegação entre todas as seções
- ✅ Múltiplos lançamentos e visualização em gráficos
- ✅ Responsividade (desktop/tablet/mobile)
- ✅ Performance de múltiplas páginas
- ✅ Persistência de dados
- ✅ Sessão - Logout e acesso protegido
- ✅ Testes E2E completos

## 🎯 Total de Testes: 94 casos de teste

## 📊 Configuração (playwright.config.ts)

```typescript
testDir: './tests'           // Diretório de testes
fullyParallel: true          // Executar em paralelo
reporter: 'html'             // Gerar relatório HTML
baseURL: 'http://localhost:4200'
trace: 'on-first-retry'      // Capturar trace ao falhar
```

## 🔍 Debugging

### Usar o Inspector
```bash
npx playwright test --debug
```

### Ver os testes em execução
```bash
npx playwright test --headed
```

### Adicionar breakpoints no código
```typescript
await page.pause();  // Pausa a execução
```

### Visualizar DOM da página
Pressione `S` no inspector para capturar screenshot

## ⚙️ Configuração de Credenciais

Os testes usam credenciais de teste:
- **Email**: `email`
- **Senha**: `senha`

Para usar outras credenciais, edite o arquivo de teste ou crie um `.env`:
```
TEST_EMAIL=seu@email.com
TEST_PASSWORD=suaSenha
```

E importe no teste:
```typescript
import dotenv from 'dotenv';
dotenv.config();
```

## 🛠️ Troubleshooting

### Testes não encontram elementos
- Verifique se a aplicação está rodando em `http://localhost:4200`
- Verifique se os seletores de elementos são corretos
- Use `--ui` para executar de forma interativa

### Timeout em testes
- Aumente o timeout global em `playwright.config.ts`:
```typescript
timeout: 30000  // 30 segundos
```

### Falha ao fazer login
- Verifique se backend está disponível
- Verifique credenciais de teste
- Verifique se a rota de login está correta (`/login`)

### Screenshots/Traces não aparecem
- Verifique se `playwright-report/` foi criado
- Execute: `npx playwright show-report`

## 📈 Métricas de Cobertura

- **Autenticação**: 100% (todas as rotas protegidas)
- **CRUD de Dados**: 100% (Create, Read, Update, Delete)
- **Validações**: 100% (campos obrigatórios, formatos)
- **Navegação**: 100% (todas as páginas principais)
- **Responsividade**: Testada em 3 viewports
- **Fluxos Completos**: 9 cenários de ponta a ponta

## 🚀 CI/CD Integration

Para integrar com GitHub Actions, crie `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm start &
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📚 Recursos Adicionais

- [Documentação Playwright](https://playwright.dev)
- [Seletores Playwright](https://playwright.dev/docs/locators)
- [API Reference](https://playwright.dev/docs/api/class-browser)

## 👥 Contribuindo

Para adicionar novos testes:
1. Crie arquivo em `tests/specs/`
2. Siga o padrão de nomenclatura: `NN-nome.spec.ts`
3. Use os helpers de `tests/fixtures/auth.ts`
4. Documente em uma seção nova deste README

## 📝 Checklist para Novos Testes

- [ ] Arquivo criado em `tests/specs/`
- [ ] Importa fixtures necessárias
- [ ] Usa `test.describe()` para agrupar
- [ ] Implementa `beforeEach()` para setup
- [ ] Testes são independentes
- [ ] Assertions claras
- [ ] Documentado neste README
- [ ] Testa caso positivo e negativo
- [ ] Timeout apropriado
- [ ] Sem dados hardcoded (usar timestamp para dados únicos)
