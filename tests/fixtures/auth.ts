import { Page } from '@playwright/test';

/**
 * Fixture de autenticação para reutilização entre testes
 */
export class AuthFixture {
    constructor(private page: Page) { }

    /**
     * Realiza login com credenciais fornecidas
     */
    async login(email: string, senha: string) {
        await this.page.goto('/');
        await this.page.getByRole('textbox', { name: 'E-mail' }).fill(email);
        await this.page.getByRole('textbox', { name: 'Senha' }).fill(senha);
        await this.page.getByRole('button', { name: 'Entrar' }).click();

        // Aguarda redirecionamento para home
        await this.page.waitForURL('**/');
    }

    /**
     * Faz logout da aplicação
     */
    async logout() {
        await this.page.getByRole('button').filter({ hasText: 'menu' }).click();
        await this.page.getByRole('link', { name: 'Sair' }).click();
        // Aguarda redirecionamento para login
        await this.page.waitForURL('**/login');
    }

    /**
     * Verifica se o usuário está autenticado (na página home)
     */
    async isAuthenticated(): Promise<boolean> {
        try {
            await this.page.waitForURL('**/', { timeout: 1000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verifica se está na tela de login
     */
    async isOnLoginPage(): Promise<boolean> {
        try {
            await this.page.waitForURL('**/login', { timeout: 1000 });
            return true;
        } catch {
            return false;
        }
    }
}

/**
 * Funções auxiliares de navegação
 */
export class NavigationHelper {
    constructor(private page: Page) { }

    /**
     * Navega para uma seção do menu
     */
    async navigateTo(menuName: string) {
        // Abre o menu mobile/desktop
        const menuButtons = await this.page.getByRole('button').filter({ hasText: 'menu' }).all();
        if (menuButtons.length > 0) {
            await menuButtons[0].click();
        }

        // Clica no item do menu
        await this.page.getByRole('link', { name: menuName }).click();
    }

    /**
     * Aguarda a página estar completamente carregada
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Volta para a home
     */
    async goHome() {
        await this.page.goto('/');
    }
}

/**
 * Helpers para preencher formulários
 */
export class FormHelper {
    constructor(private page: Page) { }

    /**
     * Preenche um campo de texto
     */
    async fillTextField(label: string, value: string) {
        await this.page.getByRole('textbox', { name: label }).fill(value);
    }

    /**
     * Seleciona uma opção em um select/dropdown
     */
    async selectOption(label: string, value: string) {
        const select = this.page.getByLabel(label);
        await select.click();
        await this.page.getByRole('option', { name: value }).click();
    }

    /**
     * Clica em um botão
     */
    async clickButton(buttonName: string) {
        await this.page.getByRole('button', { name: buttonName }).click();
    }

    /**
     * Aguarda e clica em um botão por índice
     */
    async clickButtonByIndex(index: number) {
        const buttons = await this.page.getByRole('button').all();
        if (buttons.length > index) {
            await buttons[index].click();
        }
    }

    /**
     * Verifica se uma mensagem de erro está visível
     */
    async hasErrorMessage(message: string): Promise<boolean> {
        try {
            await this.page.getByText(message).waitFor({ timeout: 1000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Aguarda por um alerta/modal do SweetAlert
     */
    async waitForAlert() {
        await this.page.waitForSelector('.swal2-container', { timeout: 5000 });
    }

    /**
     * Confirma um alerta do SweetAlert
     */
    async confirmAlert() {
        await this.page.getByRole('button', { name: 'OK' }).click();
    }
}

/**
 * Helpers para validação de dados
 */
export class AssertionHelper {
    constructor(private page: Page) { }

    /**
     * Verifica se um valor está visível na página
     */
    async isVisible(value: string): Promise<boolean> {
        try {
            await this.page.getByText(value).waitFor({ timeout: 1000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verifica se uma tabela contém um valor
     */
    async tableContains(value: string): Promise<boolean> {
        const row = this.page.locator('table tbody tr', { has: this.page.getByText(value) });
        return await row.isVisible();
    }

    /**
     * Conta quantas linhas há em uma tabela
     */
    async getTableRowCount(): Promise<number> {
        return await this.page.locator('table tbody tr').count();
    }

    /**
     * Verifica se o saldo está visível e correto
     */
    async saldoIsVisible(saldo: string): Promise<boolean> {
        return this.isVisible(`R$ ${saldo}`);
    }
}
