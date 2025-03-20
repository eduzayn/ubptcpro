import { test, expect } from '@playwright/test';

/**
 * Teste de navegação básica entre as páginas principais
 */
test.describe('Navegação básica no site', () => {
  // Antes de cada teste, ir para a página inicial
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve carregar a página inicial corretamente', async ({ page }) => {
    // Verificar se o título da página está correto
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
    
    // Verificar se os elementos principais estão visíveis
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Verificar se o conteúdo principal existe
    await expect(page.locator('main')).toBeVisible();
  });

  test('deve navegar para a página de Cursos', async ({ page }) => {
    // Clicar no link de Cursos no menu
    await page.click('nav >> text=Cursos');
    
    // Verificar se a URL mudou corretamente
    await expect(page).toHaveURL(/.*\/cursos/);
    
    // Verificar se o título da página de cursos está presente
    await expect(page.locator('h1:has-text("Nossos Cursos")')).toBeVisible();
  });

  test('deve navegar para a página Sobre', async ({ page }) => {
    // Clicar no link Sobre no menu
    await page.click('nav >> text=Sobre');
    
    // Verificar se a URL mudou corretamente
    await expect(page).toHaveURL(/.*\/sobre/);
  });

  test('deve navegar para a página de Contato', async ({ page }) => {
    // Clicar no link Contato no menu
    await page.click('nav >> text=Contato');
    
    // Verificar se a URL mudou corretamente
    await expect(page).toHaveURL(/.*\/contato/);
    
    // Verificar se o formulário de contato está presente
    await expect(page.locator('form')).toBeVisible();
  });

  test('deve navegar para a página de login ao clicar em Entrar', async ({ page }) => {
    // Clicar no botão de entrar
    await page.click('text=Entrar');
    
    // Verificar se a URL mudou corretamente
    await expect(page).toHaveURL(/.*\/login/);
    
    // Verificar se o formulário de login está presente
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('deve funcionar corretamente em telas menores (responsividade)', async ({ page }) => {
    // Redimensionar a janela para simular um dispositivo móvel
    await page.setViewportSize({ width: 480, height: 800 });
    
    // Verificar se o botão de menu hambúrguer aparece
    await expect(page.locator('button[aria-label="Abrir menu"]')).toBeVisible();
    
    // Clicar no botão do menu hambúrguer
    await page.click('button[aria-label="Abrir menu"]');
    
    // Verificar se os links do menu estão visíveis após abrir
    await expect(page.locator('nav').getByText('Cursos')).toBeVisible();
    await expect(page.locator('nav').getByText('Sobre')).toBeVisible();
    await expect(page.locator('nav').getByText('Contato')).toBeVisible();
    
    // Clicar em um link no menu mobile
    await page.locator('nav').getByText('Cursos').click();
    
    // Verificar se a navegação funcionou
    await expect(page).toHaveURL(/.*\/cursos/);
  });
}); 