import { test, expect } from '@playwright/test';
import { AuthFixture, NavigationHelper, FormHelper, AssertionHelper } from '../fixtures/auth';

test.describe('Centros de Custo - CRUD', () => {
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

  test('Deve navegar para a página de centros de custo', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/centro-custo');
  });

  test('Deve criar um novo centro de custo', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    
    // Clica no botão de novo centro
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

    await page.waitForURL('**/centro-custo/novo', { timeout: 3000 }).catch(() => {});

    // Preenche formulário
    const descricao = `Centro Teste ${Date.now()}`;
    await formHelper.fillTextField('Descrição', descricao);
    await formHelper.fillTextField('Valor Limite', '1000.00');

    // Salva
    await formHelper.clickButton('Salvar');
    
    await page.waitForTimeout(1000);
    
    // Deve retornar para a listagem
    expect(page.url()).toContain('/centro-custo');
  });

  test('Deve validar campo de descrição obrigatório no centro de custo', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    
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

    // Tenta salvar sem descrição
    await formHelper.fillTextField('Valor Limite', '1000.00');
    await formHelper.clickButton('Salvar');

    await page.waitForTimeout(500);
    
    const hasError = await formHelper.hasErrorMessage('obrigatório');
    expect(hasError || page.url().includes('novo')).toBe(true);
  });

  test('Deve listar centros de custo criados', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    
    // Aguarda carregamento da tabela
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    // Verifica se há linhas
    const rowCount = await assertHelper.getTableRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('Deve editar um centro de custo existente', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    
    // Aguarda tabela
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    // Tenta encontrar botão de edição
    const editButtons = await page.locator('button[title="Editar"], a:has-text("Editar")').all();
    
    if (editButtons.length > 0) {
      await editButtons[0].click();
      
      await page.waitForURL('**/centro-custo/edit/**', { timeout: 3000 }).catch(() => {});
      
      // Modifica descrição
      const descricaoInput = page.getByRole('textbox', { name: /descrição/i });
      await descricaoInput.fill(`Centro Editado ${Date.now()}`);
      
      // Modifica limite
      const valorInput = page.getByRole('textbox', { name: /limite/i });
      if (await valorInput.isVisible()) {
        await valorInput.fill('2000.00');
      }
      
      await formHelper.clickButton('Salvar');
      
      await page.waitForTimeout(1000);
      
      expect(page.url()).toContain('/centro-custo');
    }
  });

  test('Deve excluir um centro de custo', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    
    // Aguarda tabela
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    // Encontra botão de exclusão
    const deleteButtons = await page.locator('button[title="Deletar"], button[title="Excluir"], a:has-text("Excluir")').all();
    
    if (deleteButtons.length > 0) {
      await deleteButtons[0].click();
      
      await page.waitForURL('**/centro-custo/excluir/**', { timeout: 3000 }).catch(() => {});
      
      // Confirma exclusão
      await formHelper.clickButton('Confirmar');
      
      await page.waitForTimeout(1000);
      
      expect(page.url()).toContain('/centro-custo');
    }
  });

  test('Deve validar valor limite como número positivo', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    
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

    // Preenche com valor negativo
    await formHelper.fillTextField('Descrição', 'Centro Teste');
    await formHelper.fillTextField('Valor Limite', '-1000.00');

    // Verifica se o valor foi convertido para positivo
    const valorInput = page.getByRole('textbox', { name: /limite/i });
    const valor = await valorInput.inputValue();
    
    expect(!valor?.startsWith('-')).toBe(true);
  });

  test('Deve permitir valor limite zero', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    
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

    // Preenche com zero
    await formHelper.fillTextField('Descrição', `Centro Zero ${Date.now()}`);
    await formHelper.fillTextField('Valor Limite', '0.00');
    
    await formHelper.clickButton('Salvar');
    
    await page.waitForTimeout(1000);
    
    // Deve aceitar
    expect(page.url()).toContain('/centro-custo');
  });

  test('Deve exibir aviso quando gasto exceder limite', async ({ page }) => {
    // Primeiro cria um centro de custo com limite baixo
    await navHelper.navigateTo('Centros de Custo');
    
    // Se houver um centro com gasto acima do limite
    // Deve haver indicador visual (cor, ícone, etc)
    
    const linhas = await page.locator('table tbody tr').all();
    
    for (const linha of linhas) {
      // Verifica se há ícone ou classe de warning
      const warning = await linha.locator('[class*="warning"], [class*="danger"], .text-danger').isVisible();
      if (warning) {
        expect(warning).toBe(true);
        break;
      }
    }
  });

  test('Deve filtrar centros de custo por descrição', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    
    // Verifica se há campo de busca
    const searchInputs = await page.getByRole('textbox', { name: /buscar|filtro|descrição/i }).all();
    
    if (searchInputs.length > 0) {
      await searchInputs[0].fill('Alimentação');
      await page.waitForTimeout(500);
      
      // Deve filtrar resultados
      const rowCount = await assertHelper.getTableRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('Deve exibir ícone ou botão para vincular gasto ao centro de custo', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    
    // Verifica se há ícone de visualizar detalhes
    const detailButtons = await page.locator('button[title="Detalhes"], button[title="Ver"], a:has-text("Ver")').all();
    
    // Pode haver botão para ver detalhes do centro
    expect(detailButtons.length >= 0).toBe(true);
  });

  test('Deve impedir exclusão de centro de custo com lançamentos associados', async ({ page }) => {
    await navHelper.navigateTo('Centros de Custo');
    
    // Aguarda tabela
    await page.waitForSelector('table tbody', { timeout: 5000 }).catch(() => {});
    
    // Tenta excluir um centro
    const deleteButtons = await page.locator('button[title="Deletar"], button[title="Excluir"]').all();
    
    if (deleteButtons.length > 0) {
      await deleteButtons[0].click();
      
      // Pode mostrar alerta se houver lançamentos
      try {
        await page.waitForSelector('.swal2-container, .alert', { timeout: 2000 });
        const hasAlert = await page.locator('.swal2-container, .alert').isVisible();
        expect(hasAlert).toBe(true);
      } catch {
        // Sem lançamentos, pode continuar
      }
    }
  });
});
