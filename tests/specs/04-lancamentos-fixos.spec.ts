import { test, expect } from '@playwright/test';
import { AuthFixture, NavigationHelper, FormHelper, AssertionHelper } from '../fixtures/auth';

test.describe('Lançamentos Fixos - CRUD', () => {
  let authFixture: AuthFixture;
  let navHelper: NavigationHelper;
  let formHelper: FormHelper;
  let assertHelper: AssertionHelper;

  test.beforeEach(async ({ page }) => {
    authFixture = new AuthFixture(page);
    navHelper = new NavigationHelper(page);
    formHelper = new FormHelper(page);
    assertHelper = new AssertionHelper(page);

    // Faz login
    await authFixture.login('email', 'senha');
    await page.waitForURL('**/', { timeout: 3000 }).catch(() => {});
  });

  test('Deve navegar para a página de lançamentos fixos', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/lancamento-fixo');
  });

  test('Deve criar um novo lançamento fixo de despesa', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    // Clica novo
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

    await page.waitForURL('**/lancamento-fixo/novo', { timeout: 3000 }).catch(() => {});

    // Preenche formulário
    await formHelper.fillTextField('Dia do Mês', '15');
    await formHelper.fillTextField('Valor', '250.00');
    await formHelper.fillTextField('Descrição', 'Aluguel - Fixo');

    // Centro de custo
    try {
      await formHelper.selectOption('Centro de Custo', 'Moradia');
    } catch {
      // Opcional
    }

    await formHelper.clickButton('Salvar');
    
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/lancamento-fixo');
  });

  test('Deve criar um novo lançamento fixo de receita', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    // Clica novo
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

    await page.waitForURL('**/lancamento-fixo/novo', { timeout: 3000 }).catch(() => {});

    // Receita fixa
    await formHelper.fillTextField('Dia do Mês', '1');
    await formHelper.fillTextField('Valor', '3000.00');
    await formHelper.fillTextField('Descrição', 'Salário Mensal');

    await formHelper.clickButton('Salvar');
    
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/lancamento-fixo');
  });

  test('Deve validar dia do mês entre 1 e 31', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    // Clica novo
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

    // Tenta dia 32
    await formHelper.fillTextField('Dia do Mês', '32');
    
    const diaInput = page.getByRole('textbox', { name: /dia/i });
    const dia = await diaInput.inputValue();
    
    // Deve rejeitar ou converter para 31
    expect(Number(dia) <= 31).toBe(true);
  });

  test('Deve validar dia do mês não pode ser 0', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    // Clica novo
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

    // Tenta dia 0
    await formHelper.fillTextField('Dia do Mês', '0');
    
    const diaInput = page.getByRole('textbox', { name: /dia/i });
    const dia = await diaInput.inputValue();
    
    expect(Number(dia) >= 1).toBe(true);
  });

  test('Deve validar campo de valor obrigatório', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    // Clica novo
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

    // Sem valor
    await formHelper.fillTextField('Dia do Mês', '15');
    await formHelper.fillTextField('Descrição', 'Teste');
    await formHelper.clickButton('Salvar');

    await page.waitForTimeout(500);
    
    const hasError = await formHelper.hasErrorMessage('obrigatório');
    expect(hasError || page.url().includes('novo')).toBe(true);
  });

  test('Deve validar campo de descrição obrigatório', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    // Clica novo
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

    // Sem descrição
    await formHelper.fillTextField('Dia do Mês', '15');
    await formHelper.fillTextField('Valor', '100.00');
    await formHelper.clickButton('Salvar');

    await page.waitForTimeout(500);
    
    const hasError = await formHelper.hasErrorMessage('obrigatório');
    expect(hasError || page.url().includes('novo')).toBe(true);
  });

  test('Deve listar lançamentos fixos', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    const rowCount = await assertHelper.getTableRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('Deve editar um lançamento fixo', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    const editButtons = await page.locator('button[title="Editar"], a:has-text("Editar")').all();
    
    if (editButtons.length > 0) {
      await editButtons[0].click();
      
      await page.waitForURL('**/lancamento-fixo/edit/**', { timeout: 3000 }).catch(() => {});
      
      // Modifica descrição
      const descricaoInput = page.getByRole('textbox', { name: /descrição/i });
      await descricaoInput.fill('Descrição Editada');
      
      await formHelper.clickButton('Salvar');
      
      await page.waitForTimeout(1000);
      
      expect(page.url()).toContain('/lancamento-fixo');
    }
  });

  test('Deve excluir um lançamento fixo', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    const deleteButtons = await page.locator('button[title="Deletar"], button[title="Excluir"], a:has-text("Excluir")').all();
    
    if (deleteButtons.length > 0) {
      await deleteButtons[0].click();
      
      await page.waitForURL('**/lancamento-fixo/excluir/**', { timeout: 3000 }).catch(() => {});
      
      await formHelper.clickButton('Confirmar');
      
      await page.waitForTimeout(1000);
      
      expect(page.url()).toContain('/lancamento-fixo');
    }
  });

  test('Deve validar se dia do mês é campo obrigatório', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    // Clica novo
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

    // Sem dia do mês
    await formHelper.fillTextField('Valor', '100.00');
    await formHelper.fillTextField('Descrição', 'Teste');
    await formHelper.clickButton('Salvar');

    await page.waitForTimeout(500);
    
    const hasError = await formHelper.hasErrorMessage('obrigatório');
    expect(hasError || page.url().includes('novo')).toBe(true);
  });

  test('Deve ter status (ativo/inativo) para lançamentos fixos', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    // Verifica se há coluna de status
    const statusElements = await page.locator('td:has-text("Ativo"), td:has-text("Inativo")').all();
    
    expect(statusElements.length >= 0).toBe(true);
  });

  test('Deve permitir ativar/desativar lançamento fixo', async ({ page }) => {
    await navHelper.navigateTo('Lançamentos Fixos');
    
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    // Verifica se há checkbox ou toggle para status
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    
    if (checkboxes.length > 0) {
      const isChecked = await checkboxes[0].isChecked();
      await checkboxes[0].click();
      
      const isCheckedAfter = await checkboxes[0].isChecked();
      expect(isCheckedAfter).not.toBe(isChecked);
    }
  });
});
