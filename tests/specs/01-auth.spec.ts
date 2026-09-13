import { test, expect } from '@playwright/test';
import { AuthFixture, NavigationHelper, FormHelper } from '../fixtures/auth';

test.describe('Autenticação', () => {
  let authFixture: AuthFixture;
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    authFixture = new AuthFixture(page);
    formHelper = new FormHelper(page);
  });

  test('Deve fazer login com credenciais válidas', async ({ page }) => {
    authFixture = new AuthFixture(page);
    await authFixture.login('email', 'senha');
    
    // Verifica se foi redirecionado para home
    const isAuth = await authFixture.isAuthenticated();
    expect(isAuth).toBe(true);
  });

  test('Deve exibir erro ao fazer login com email vazio', async ({ page }) => {
    authFixture = new AuthFixture(page);
    formHelper = new FormHelper(page);
    
    await page.goto('/');
    
    // Deixa email vazio e tenta enviar
    await formHelper.fillTextField('Senha', 'senha');
    await formHelper.clickButton('Entrar');
    
    // Aguarda validação
    await page.waitForTimeout(500);
    
    // Deve permanecer na página de login
    const isOnLogin = await authFixture.isOnLoginPage();
    expect(isOnLogin).toBe(true);
  });

  test('Deve exibir erro ao fazer login com senha vazia', async ({ page }) => {
    authFixture = new AuthFixture(page);
    formHelper = new FormHelper(page);
    
    await page.goto('/');
    
    // Preenche apenas email
    await formHelper.fillTextField('E-mail', 'email@teste.com');
    await formHelper.clickButton('Entrar');
    
    // Aguarda validação
    await page.waitForTimeout(500);
    
    // Deve permanecer na página de login
    const isOnLogin = await authFixture.isOnLoginPage();
    expect(isOnLogin).toBe(true);
  });

  test('Deve fazer logout corretamente', async ({ page }) => {
    authFixture = new AuthFixture(page);
    
    // Faz login
    await authFixture.login('meu_email', 'minha_senha');
    
    // Faz logout
    await authFixture.logout();
    
    // Verifica se está na página de login
    const isOnLogin = await authFixture.isOnLoginPage();
    expect(isOnLogin).toBe(true);
  });

  test('Deve manter sessão ao recarregar página após login', async ({ page }) => {
    authFixture = new AuthFixture(page);
    
    // Faz login
    await authFixture.login('email', 'senha');
    
    // Recarrega a página
    await page.reload();
    
    // Aguarda carregamento
    await page.waitForURL('**/', { timeout: 3000 }).catch(() => {});
    
    // Verifica autenticação
    expect(page.url()).not.toContain('/login');
  });

  test('Deve limpar sessão ao fazer logout', async ({ page }) => {
    authFixture = new AuthFixture(page);
    
    // Faz login
    await authFixture.login('email', 'senha');
    
    // Faz logout
    await authFixture.logout();
    
    // Tenta acessar / diretamente
    await page.goto('/');
    
    // Deve ser redirecionado para login
    await page.waitForURL('**/login', { timeout: 3000 }).catch(() => {});
    expect(page.url()).toContain('/login');
  });

  test('Deve validar formato de email', async ({ page }) => {
    authFixture = new AuthFixture(page);
    formHelper = new FormHelper(page);
    
    await page.goto('/');
    
    // Preenche com email inválido
    const emailInput = await page.getByRole('textbox', { name: 'E-mail' });
    await emailInput.fill('emailinvalido');
    await formHelper.fillTextField('Senha', 'senha123');
    
    // Tenta fazer login
    await formHelper.clickButton('Entrar');
    
    // Deve permanecer no login ou mostrar erro
    await page.waitForTimeout(500);
    const isOnLogin = await authFixture.isOnLoginPage();
    expect(isOnLogin).toBe(true);
  });

  test('Deve ter campos obrigatórios no formulário de login', async ({ page }) => {
    authFixture = new AuthFixture(page);
    
    await page.goto('/');
    
    // Verifica se campos existem
    const emailInput = page.getByRole('textbox', { name: 'E-mail' });
    const senhaInput = page.getByRole('textbox', { name: 'Senha' });
    const loginButton = page.getByRole('button', { name: 'Entrar' });
    
    expect(await emailInput.isVisible()).toBe(true);
    expect(await senhaInput.isVisible()).toBe(true);
    expect(await loginButton.isVisible()).toBe(true);
  });
});
