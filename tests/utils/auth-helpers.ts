import { Page, expect } from '@playwright/test';

/**
 * Tipos de usuários para login nos testes
 */
export type UserRole = 'admin' | 'instructor' | 'student' | 'guest';

/**
 * Credenciais de usuários para testes
 */
const TEST_USERS = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
  },
  instructor: {
    email: 'instructor@example.com',
    password: 'instructor123',
  },
  student: {
    email: 'student@example.com',
    password: 'student123',
  },
};

/**
 * Faz login como um usuário específico
 * @param page Instância da página do Playwright
 * @param role Papel do usuário (admin, instructor, student)
 */
export async function loginAs(page: Page, role: UserRole): Promise<void> {
  // Não é necessário fazer login para guest
  if (role === 'guest') return;

  // Obter credenciais do usuário
  const user = TEST_USERS[role];
  if (!user) {
    throw new Error(`Usuário com papel "${role}" não definido para testes`);
  }

  // Navegar para a página de login
  await page.goto('/login');

  // Preencher o formulário de login
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);

  // Clicar no botão de login
  await page.click('button[type="submit"]');

  // Aguardar redirecionamento após o login
  await page.waitForURL('**/dashboard');
}

/**
 * Faz logout do usuário atual
 * @param page Instância da página do Playwright
 */
export async function logout(page: Page): Promise<void> {
  // Verificar se há um usuário logado (procurar o botão de perfil)
  const profileButton = page.locator('.user-profile-button');
  const isLoggedIn = await profileButton.isVisible();

  if (isLoggedIn) {
    // Clicar no botão de perfil para abrir o menu
    await profileButton.click();

    // Clicar na opção de logout
    await page.click('button:has-text("Sair")');

    // Aguardar redirecionamento para a página inicial
    await page.waitForURL('**/');
  }
}

/**
 * Verifica se o usuário atual tem acesso a uma página específica
 * @param page Instância da página do Playwright
 * @param url URL da página a ser verificada
 * @returns true se o usuário tem acesso, false caso contrário
 */
export async function hasAccess(page: Page, url: string): Promise<boolean> {
  // Salvar a URL atual
  const currentUrl = page.url();

  // Navegar para a URL desejada
  await page.goto(url);

  // Verificar se foi redirecionado para a página de login
  const isRedirectedToLogin = page.url().includes('/login');
  
  // Verificar se apareceu mensagem de acesso negado
  const hasAccessDeniedMessage = await page.locator('text="Acesso negado"').isVisible();

  // Voltar para a URL original
  await page.goto(currentUrl);

  // Retornar true se NÃO foi redirecionado para login e NÃO apareceu mensagem de acesso negado
  return !isRedirectedToLogin && !hasAccessDeniedMessage;
}

/**
 * Cria um usuário de teste temporário
 * @param page Instância da página do Playwright
 * @param role Papel do usuário (instructor, student)
 * @returns Dados do usuário criado
 */
export async function createTestUser(page: Page, role: 'instructor' | 'student') {
  // Primeiro fazer login como admin
  await loginAs(page, 'admin');

  // Navegar para gerenciamento de usuários
  await page.goto('/admin/usuarios');

  // Clicar no botão de adicionar usuário
  await page.click('button:has-text("Adicionar Usuário")');

  // Gerar email único baseado no timestamp
  const timestamp = new Date().getTime();
  const email = `test-${role}-${timestamp}@example.com`;
  const password = `test123`;
  const name = `Usuário Teste ${role} ${timestamp}`;

  // Preencher o formulário
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.selectOption('select[name="role"]', role);

  // Salvar o novo usuário
  await page.click('button:has-text("Salvar")');

  // Aguardar feedback de sucesso
  await page.waitForSelector('.toast-success:has-text("Usuário criado")');

  // Fazer logout do admin
  await logout(page);

  // Retornar os dados do usuário criado
  return {
    name,
    email,
    password,
    role
  };
}

/**
 * Remove um usuário de teste
 * @param page Instância da página do Playwright
 * @param email Email do usuário a ser removido
 */
export async function removeTestUser(page: Page, email: string): Promise<void> {
  // Fazer login como admin
  await loginAs(page, 'admin');

  // Navegar para gerenciamento de usuários
  await page.goto('/admin/usuarios');

  // Buscar o usuário pelo email
  await page.fill('input[placeholder*="Buscar usuário"]', email);
  await page.press('input[placeholder*="Buscar usuário"]', 'Enter');

  // Verificar se o usuário foi encontrado
  const userRow = page.locator(`tr:has-text("${email}")`);
  const userExists = await userRow.isVisible();

  if (userExists) {
    // Clicar no botão de excluir
    await userRow.locator('button:has-text("Excluir")').click();

    // Confirmar a exclusão
    await page.click('button:has-text("Confirmar")');

    // Aguardar feedback de sucesso
    await page.waitForSelector('.toast-success:has-text("Usuário removido")');
  }

  // Fazer logout
  await logout(page);
}

/**
 * Utilitário para obter token de autenticação (útil para testes de API)
 * 
 * @param page - Página atual do Playwright
 * @param role - Papel do usuário para login
 * @returns Promise<string> - Token de autenticação
 */
export async function getAuthToken(page: Page, role: UserRole): Promise<string> {
  const user = TEST_USERS[role];
  
  // Fazer a requisição de login diretamente
  const response = await page.request.post('/api/auth/login', {
    data: {
      email: user.email,
      password: user.password
    }
  });
  
  const responseBody = await response.json();
  return responseBody.token;
} 