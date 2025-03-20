import { test, expect } from '@playwright/test';

/**
 * Testes para o fluxo de login
 */
test.describe('Funcionalidade de Login', () => {
  // Antes de cada teste, ir para a página de login
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    
    // Verificar se estamos na página correta
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('form')).toBeVisible();
  });

  test('deve exibir mensagem de erro com email inválido', async ({ page }) => {
    // Preencher o formulário com um email inválido
    await page.fill('input[type="email"]', 'email_invalido');
    await page.fill('input[type="password"]', 'senha123');
    
    // Clicar no botão de entrar
    await page.click('button[type="submit"]');
    
    // Verificar se aparece uma mensagem de erro sobre o email
    await expect(page.locator('text=Email inválido')).toBeVisible();
    
    // Verificar se não fomos redirecionados (permanecemos na página de login)
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('deve exibir mensagem para senha muito curta', async ({ page }) => {
    // Preencher o formulário com uma senha muito curta
    await page.fill('input[type="email"]', 'usuario@exemplo.com');
    await page.fill('input[type="password"]', '123');
    
    // Clicar no botão de entrar
    await page.click('button[type="submit"]');
    
    // Verificar se aparece uma mensagem de erro sobre a senha
    await expect(page.locator('text=Senha muito curta')).toBeVisible();
    
    // Verificar se não fomos redirecionados (permanecemos na página de login)
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('deve exibir mensagem com credenciais incorretas', async ({ page }) => {
    // Preencher o formulário com credenciais que existem mas estão incorretas
    await page.fill('input[type="email"]', 'usuario_inexistente@exemplo.com');
    await page.fill('input[type="password"]', 'senha_incorreta123');
    
    // Clicar no botão de entrar
    await page.click('button[type="submit"]');
    
    // Verificar se aparece uma mensagem de erro sobre credenciais inválidas
    await expect(page.locator('text=Email ou senha incorretos')).toBeVisible();
    
    // Verificar se não fomos redirecionados (permanecemos na página de login)
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('deve conseguir fazer login com credenciais válidas', async ({ page }) => {
    // Preencher o formulário com credenciais válidas
    // Nota: Em testes reais, usaríamos usuários de teste específicos para este propósito
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.fill('input[type="password"]', 'senha123');
    
    // Clicar no botão de entrar
    await page.click('button[type="submit"]');
    
    // Verificar se fomos redirecionados para a página inicial após o login
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Verificar se elementos que só aparecem para usuários logados estão visíveis
    await expect(page.locator('text=Minha Conta')).toBeVisible();
    
    // Verificar se o nome do usuário aparece no cabeçalho
    await expect(page.locator('header')).toContainText('Usuário Teste');
  });

  test('deve permitir redefinição de senha', async ({ page }) => {
    // Clicar no link "Esqueci minha senha"
    await page.click('text=Esqueci minha senha');
    
    // Verificar se fomos redirecionados para a página de redefinição
    await expect(page).toHaveURL(/.*\/redefinir-senha/);
    
    // Verificar se o formulário de redefinição está presente
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Enviar link")')).toBeVisible();
    
    // Preencher o email para redefinição
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.click('button:has-text("Enviar link")');
    
    // Verificar se aparece mensagem de confirmação
    await expect(page.locator('text=Email de redefinição enviado')).toBeVisible();
  });

  test('deve permitir ir para a página de cadastro', async ({ page }) => {
    // Clicar no link para criar uma conta
    await page.click('text=Criar uma conta');
    
    // Verificar se fomos redirecionados para a página de cadastro
    await expect(page).toHaveURL(/.*\/cadastro/);
    
    // Verificar se o formulário de cadastro está presente
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
}); 