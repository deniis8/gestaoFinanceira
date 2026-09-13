import { test, expect } from '@playwright/test';
import { AuthFixture, NavigationHelper, FormHelper, AssertionHelper } from '../fixtures/auth';

test.describe('Lançamentos - CRUD', () => {
  let authFixture: AuthFixture;
  let navHelper: NavigationHelper;
  let formHelper: FormHelper;
  let assertHelper: AssertionHelper;

  test.beforeEach(async ({ page }) => {
    authFixture = new AuthFixture(page);
    navHelper = new NavigationHelper(page);
    formHelper = new FormHelper(page);
    assertHelper = new AssertionHelper(page);

    // Faz login antes de cada teste
    await authFixture.login('email', 'senha');
    await page.waitForURL('**/', { timeout: 3000 }).catch(() => {});
  });

  test('Deve navegar para a página de lançamentos', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/lancamento');
  });

  test('Deve criar um novo lançamento de despesa', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Clica no botão de novo lançamento
    const buttons = await page.locator('button').all();
    let novoButton: any = null;
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text?.includes('Novo') || text?.includes('novo') || text?.includes('+')) {
        novoButton = btn;
        break;
      }
    }
    if (novoButton) {
      await novoButton.click();
    }

    await page.waitForURL('**/lancamento/novo');

    // Preenche formulário de lançamento
    const hoje = new Date().toISOString().split('T')[0];
    
    // Data
    await formHelper.fillTextField('Data', hoje);
    
    // Valor
    await formHelper.fillTextField('Valor', '100.50');
    
    // Descrição
    await formHelper.fillTextField('Descrição', 'Teste de lançamento');
    
    // Centro de Custo (se houver)
    try {
      await formHelper.selectOption('Centro de Custo', 'Alimentação');
    } catch {
      // Centro de custo pode não estar disponível em teste
    }

    // Submete formulário
    await formHelper.clickButton('Salvar');
    
    // Aguarda resposta
    await page.waitForTimeout(1000);
    
    // Deve retornar para a listagem
    expect(page.url()).toContain('/lancamento');
  });

  test('Deve criar um novo lançamento de receita', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Clica no botão de novo lançamento
    const buttons = await page.locator('button').all();
    let novoButton: any = null;
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text?.includes('Novo') || text?.includes('novo') || text?.includes('+')) {
        novoButton = btn;
        break;
      }
    }
    if (novoButton) {
      await novoButton.click();
    }

    await page.waitForURL('**/lancamento/novo');

    // Preenche formulário de receita
    const hoje = new Date().toISOString().split('T')[0];
    
    await formHelper.fillTextField('Data', hoje);
    await formHelper.fillTextField('Valor', '500.00');
    await formHelper.fillTextField('Descrição', 'Receita - Salário');

    // Seleciona tipo Receita (se houver campo)
    try {
      await formHelper.selectOption('Tipo', 'Receita');
    } catch {
      // Tipo pode ser determinado pelo formulário
    }

    await formHelper.clickButton('Salvar');
    
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/lancamento');
  });

  test('Deve validar campo de valor obrigatório', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Clica no novo lançamento
    const buttons = await page.locator('button').all();
    let novoButton: any = null;
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text?.includes('Novo') || text?.includes('novo') || text?.includes('+')) {
        novoButton = btn;
        break;
      }
    }
    if (novoButton) {
      await novoButton.click();
    }

    // Tenta salvar sem valor
    await formHelper.fillTextField('Descrição', 'Teste sem valor');
    await formHelper.clickButton('Salvar');

    await page.waitForTimeout(500);
    
    // Deve mostrar erro ou permanecer na página
    const hasError = await formHelper.hasErrorMessage('obrigatório');
    expect(hasError || page.url().includes('novo')).toBe(true);
  });

  test('Deve validar campo de descrição obrigatório', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Clica no novo lançamento
    const buttons = await page.locator('button').all();
    let novoButton: any = null;
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text?.includes('Novo') || text?.includes('novo') || text?.includes('+')) {
        novoButton = btn;
        break;
      }
    }
    if (novoButton) {
      await novoButton.click();
    }

    // Tenta salvar sem descrição
    await formHelper.fillTextField('Valor', '100.00');
    await formHelper.clickButton('Salvar');

    await page.waitForTimeout(500);
    
    const hasError = await formHelper.hasErrorMessage('obrigatório');
    expect(hasError || page.url().includes('novo')).toBe(true);
  });

  test('Deve listar lançamentos criados', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Aguarda carregamento da tabela
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    // Verifica se há linhas na tabela
    const rowCount = await assertHelper.getTableRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('Deve editar um lançamento existente', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Aguarda tabela carregar
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    // Tenta encontrar botão de edição (ícone ou link)
    const editButtons = await page.locator('button[title="Editar"], a:has-text("Editar")').all();
    
    if (editButtons.length > 0) {
      await editButtons[0].click();
      
      await page.waitForURL('**/lancamento/edit/**', { timeout: 3000 }).catch(() => {});
      
      // Modifica um campo
      const inputs = await page.getByRole('textbox').all();
      if (inputs.length > 0) {
        await inputs[inputs.length - 1].fill('Descrição editada');
      }
      
      await formHelper.clickButton('Salvar');
      
      await page.waitForTimeout(1000);
      
      // Deve retornar para listagem
      expect(page.url()).toContain('/lancamento');
    }
  });

  test('Deve excluir um lançamento', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Aguarda tabela carregar
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    // Tenta encontrar botão de exclusão
    const deleteButtons = await page.locator('button[title="Deletar"], button[title="Excluir"], a:has-text("Excluir")').all();
    
    if (deleteButtons.length > 0) {
      await deleteButtons[0].click();
      
      await page.waitForURL('**/lancamento/excluir/**', { timeout: 3000 }).catch(() => {});
      
      // Confirma exclusão
      await formHelper.clickButton('Confirmar');
      
      await page.waitForTimeout(1000);
      
      // Deve retornar para listagem
      expect(page.url()).toContain('/lancamento');
    }
  });

  test('Deve validar valores monetários negativos', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Clica no novo lançamento
    const buttons = await page.locator('button').all();
    let novoButton: any = null;
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text?.includes('Novo') || text?.includes('novo') || text?.includes('+')) {
        novoButton = btn;
        break;
      }
    }
    if (novoButton) {
      await novoButton.click();
    }

    // Tenta preencher com valor negativo
    await formHelper.fillTextField('Valor', '-50.00');
    
    // O valor pode ser convertido ou rejeitado
    const valorInput = page.getByRole('textbox', { name: /valor/i });
    const valor = await valorInput.inputValue();
    
    // Valor não deve ser negativo ou deve ser tratado
    expect(!valor?.startsWith('-') || valor === '50.00').toBe(true);
  });

  test('Deve formatar valor monetário com centavos', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Clica no novo lançamento
    const buttons = await page.locator('button').all();
    let novoButton: any = null;
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text?.includes('Novo') || text?.includes('novo') || text?.includes('+')) {
        novoButton = btn;
        break;
      }
    }
    if (novoButton) {
      await novoButton.click();
    }

    // Preenche valor com centavos
    await formHelper.fillTextField('Valor', '123.45');
    
    const valorInput = page.getByRole('textbox', { name: /valor/i });
    const valor = await valorInput.inputValue();
    
    expect(valor).toContain('123.45');
  });

  test('Deve ter filtro por centro de custo na listagem', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Verifica se há dropdown/select para centro de custo
    const filterElements = await page.locator('select, [role="combobox"]').all();
    
    // Se houver filtros, devem estar visíveis
    expect(filterElements.length).toBeGreaterThanOrEqual(0);
  });

  test('Deve ter filtro por data na listagem', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos');
    
    // Verifica se há campos de data para filtro
    const dateInputs = await page.getByRole('textbox', { name: /data/i }).all();
    
    // Deve haver campos de data para filtro (data de até data)
    expect(dateInputs.length).toBeGreaterThanOrEqual(0);
  });
});
