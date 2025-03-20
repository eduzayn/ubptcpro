import { test, expect } from '@playwright/test';

/**
 * Testes para o componente Header
 */
test.describe('Componente Header', () => {
  // Teste padrão para usuário não autenticado
  test('deve exibir corretamente para usuários não autenticados', async ({ page }) => {
    // Ir para a página inicial
    await page.goto('/');
    
    // Verificar se o header está visível
    await expect(page.locator('header')).toBeVisible();
    
    // Verificar se o logo está visível
    await expect(page.locator('header img[alt*="logo"]')).toBeVisible();
    
    // Verificar se os links de navegação estão presentes
    await expect(page.locator('header nav')).toBeVisible();
    await expect(page.locator('header nav a')).toHaveCount(4); // Ajustar conforme o número real de links
    
    // Verificar se o botão de login está presente
    await expect(page.locator('header a:has-text("Entrar")')).toBeVisible();
    
    // Verificar se o botão de cadastro está presente
    await expect(page.locator('header a:has-text("Cadastrar")')).toBeVisible();
    
    // Verificar se o botão de menu mobile está presente
    await expect(page.locator('header button[aria-label="Abrir menu"]')).toBeVisible();
  });
  
  test('deve abrir o menu mobile ao clicar no botão', async ({ page }) => {
    // Ir para a página inicial
    await page.goto('/');
    
    // Redimensionar para tamanho mobile
    await page.setViewportSize({ width: 480, height: 800 });
    
    // Verificar se o menu está inicialmente fechado
    await expect(page.locator('header nav.mobile-menu')).not.toBeVisible();
    
    // Clicar no botão de menu
    await page.click('header button[aria-label="Abrir menu"]');
    
    // Verificar se o menu mobile está agora visível
    await expect(page.locator('header nav.mobile-menu')).toBeVisible();
    await expect(page.locator('header nav.mobile-menu a')).toBeVisible();
    
    // Verificar se o botão mudou para fechar menu
    await expect(page.locator('header button[aria-label="Fechar menu"]')).toBeVisible();
    
    // Fechar o menu
    await page.click('header button[aria-label="Fechar menu"]');
    
    // Verificar se o menu fechou
    await expect(page.locator('header nav.mobile-menu')).not.toBeVisible();
  });
  
  test('deve exibir corretamente para usuários autenticados', async ({ page }) => {
    // Ir para a página de login
    await page.goto('/login');
    
    // Fazer login com usuário válido
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    // Verificar se fomos redirecionados para a dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Verificar se o header exibe informações do usuário logado
    await expect(page.locator('header .user-info')).toBeVisible();
    await expect(page.locator('header .user-avatar')).toBeVisible();
    
    // Verificar se o botão de login NÃO está mais visível
    await expect(page.locator('header a:has-text("Entrar")')).not.toBeVisible();
    
    // Verificar se o menu do usuário está disponível
    await page.click('header .user-avatar');
    await expect(page.locator('.user-dropdown')).toBeVisible();
    await expect(page.locator('.user-dropdown a:has-text("Minha Conta")')).toBeVisible();
    await expect(page.locator('.user-dropdown a:has-text("Sair")')).toBeVisible();
  });
  
  test('deve funcionar o logout ao clicar em Sair', async ({ page }) => {
    // Ir para a página de login
    await page.goto('/login');
    
    // Fazer login com usuário válido
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    // Verificar se fomos redirecionados para a dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Abrir o menu do usuário
    await page.click('header .user-avatar');
    
    // Clicar em Sair
    await page.click('.user-dropdown a:has-text("Sair")');
    
    // Verificar se voltamos para a página inicial
    await expect(page).toHaveURL('/');
    
    // Verificar se o botão de login está visível novamente
    await expect(page.locator('header a:has-text("Entrar")')).toBeVisible();
  });
  
  test('deve destacar o item de menu ativo', async ({ page }) => {
    // Ir para a página inicial
    await page.goto('/');
    
    // Verificar se o link Home está destacado
    await expect(page.locator('header nav a.active:has-text("Home")')).toBeVisible();
    
    // Navegar para a página de cursos
    await page.click('header nav a:has-text("Cursos")');
    
    // Verificar se a URL mudou
    await expect(page).toHaveURL(/.*\/cursos/);
    
    // Verificar se agora o link Cursos está destacado
    await expect(page.locator('header nav a.active:has-text("Cursos")')).toBeVisible();
    
    // Verificar se o link Home NÃO está mais destacado
    await expect(page.locator('header nav a:has-text("Home")')).not.toHaveClass(/active/);
  });
}); 