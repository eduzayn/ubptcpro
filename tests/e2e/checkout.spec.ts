import { test, expect } from '@playwright/test';

/**
 * Testes para o fluxo de checkout e pagamento
 */
test.describe('Processo de Checkout', () => {
  // Dados do usuário para teste
  const testUser = {
    email: 'cliente_teste@exemplo.com',
    password: 'senha123',
    name: 'Cliente Teste',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321'
  };
  
  // Antes de todos os testes, fazer login
  test.beforeEach(async ({ page }) => {
    // Navegar para a página de login
    await page.goto('/login');
    
    // Verificar se estamos na página de login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Fazer login
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Verificar se o login foi bem-sucedido
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
  
  test('deve adicionar um curso ao carrinho e ir para o checkout', async ({ page }) => {
    // Navegar para a página de cursos
    await page.goto('/cursos');
    
    // Selecionar o primeiro curso disponível
    await page.click('.curso-card:first-child a');
    
    // Na página de detalhes do curso, verificar se o botão "Comprar" está disponível
    await expect(page.locator('button:has-text("Comprar")')).toBeVisible();
    
    // Clicar no botão "Comprar"
    await page.click('button:has-text("Comprar")');
    
    // Verificar se o curso foi adicionado ao carrinho (pode ser um modal ou redirecionamento)
    await expect(page.locator('.carrinho-mensagem')).toContainText('adicionado ao carrinho');
    
    // Clicar para ir ao carrinho
    await page.click('a:has-text("Ver carrinho")');
    
    // Verificar se estamos na página do carrinho
    await expect(page).toHaveURL(/.*\/carrinho/);
    
    // Verificar se o item está no carrinho
    await expect(page.locator('.carrinho-item')).toBeVisible();
    
    // Verificar se o botão "Finalizar Compra" está disponível
    await expect(page.locator('button:has-text("Finalizar Compra")')).toBeVisible();
    
    // Clicar no botão "Finalizar Compra"
    await page.click('button:has-text("Finalizar Compra")');
    
    // Verificar se fomos direcionados para a página de checkout
    await expect(page).toHaveURL(/.*\/checkout/);
  });
  
  test('deve preencher dados de faturamento e selecionar método de pagamento', async ({ page }) => {
    // Navegar para um curso e adicionar ao carrinho
    await page.goto('/cursos');
    await page.click('.curso-card:first-child a');
    await page.click('button:has-text("Comprar")');
    await page.click('a:has-text("Ver carrinho")');
    await page.click('button:has-text("Finalizar Compra")');
    
    // Verificar se estamos na página de checkout
    await expect(page).toHaveURL(/.*\/checkout/);
    
    // Verificar se o formulário de dados de faturamento está visível
    await expect(page.locator('form#checkout-form')).toBeVisible();
    
    // Preencher dados de faturamento se necessário (podem estar preenchidos do cadastro)
    // Se os campos estiverem vazios, preencher
    if (await page.locator('input[name="name"]').inputValue() === '') {
      await page.fill('input[name="name"]', testUser.name);
    }
    
    if (await page.locator('input[name="cpf"]').inputValue() === '') {
      await page.fill('input[name="cpf"]', testUser.cpf);
    }
    
    if (await page.locator('input[name="phone"]').inputValue() === '') {
      await page.fill('input[name="phone"]', testUser.phone);
    }
    
    // Selecionar método de pagamento - Cartão de Crédito
    await page.click('input[name="payment_method"][value="credit_card"]');
    
    // Verificar se o formulário de cartão aparece
    await expect(page.locator('.credit-card-form')).toBeVisible();
    
    // Preencher dados do cartão
    await page.fill('input[name="card_number"]', '4111 1111 1111 1111');  // Número de cartão de teste
    await page.fill('input[name="card_name"]', testUser.name);
    await page.fill('input[name="card_expiry"]', '12/25');
    await page.fill('input[name="card_cvv"]', '123');
    
    // Verificar o resumo da compra
    await expect(page.locator('.checkout-resumo')).toBeVisible();
    await expect(page.locator('.checkout-total')).toBeVisible();
    
    // Verificar se o botão de pagamento está habilitado
    await expect(page.locator('button:has-text("Confirmar Pagamento")')).toBeEnabled();
  });
  
  test('deve processar pagamento com boleto', async ({ page }) => {
    // Navegar para um curso e adicionar ao carrinho
    await page.goto('/cursos');
    await page.click('.curso-card:first-child a');
    await page.click('button:has-text("Comprar")');
    await page.click('a:has-text("Ver carrinho")');
    await page.click('button:has-text("Finalizar Compra")');
    
    // Verificar se estamos na página de checkout
    await expect(page).toHaveURL(/.*\/checkout/);
    
    // Selecionar método de pagamento - Boleto
    await page.click('input[name="payment_method"][value="boleto"]');
    
    // Verificar se informações de boleto aparecem
    await expect(page.locator('.boleto-info')).toBeVisible();
    
    // Verificar o resumo da compra
    await expect(page.locator('.checkout-resumo')).toBeVisible();
    await expect(page.locator('.checkout-total')).toBeVisible();
    
    // Verificar se o botão de gerar boleto está habilitado
    await expect(page.locator('button:has-text("Gerar Boleto")')).toBeEnabled();
    
    // Clicar em Gerar Boleto
    await page.click('button:has-text("Gerar Boleto")');
    
    // Verificar se o boleto foi gerado (pode mostrar um PDF ou um link)
    await expect(page.locator('.boleto-gerado')).toBeVisible();
    await expect(page.locator('a:has-text("Baixar Boleto")')).toBeVisible();
    
    // Verificar se fomos redirecionados para a página de confirmação
    await expect(page).toHaveURL(/.*\/pedido-confirmado/);
  });
  
  test('deve processar pagamento com Pix', async ({ page }) => {
    // Navegar para um curso e adicionar ao carrinho
    await page.goto('/cursos');
    await page.click('.curso-card:first-child a');
    await page.click('button:has-text("Comprar")');
    await page.click('a:has-text("Ver carrinho")');
    await page.click('button:has-text("Finalizar Compra")');
    
    // Verificar se estamos na página de checkout
    await expect(page).toHaveURL(/.*\/checkout/);
    
    // Selecionar método de pagamento - Pix
    await page.click('input[name="payment_method"][value="pix"]');
    
    // Verificar se informações de Pix aparecem
    await expect(page.locator('.pix-info')).toBeVisible();
    
    // Verificar o resumo da compra
    await expect(page.locator('.checkout-resumo')).toBeVisible();
    await expect(page.locator('.checkout-total')).toBeVisible();
    
    // Clicar em Gerar Pix
    await page.click('button:has-text("Gerar Pix")');
    
    // Verificar se o QR Code do Pix foi gerado
    await expect(page.locator('.pix-qrcode')).toBeVisible();
    await expect(page.locator('.pix-codigo-copia')).toBeVisible();
    
    // Verificar se o botão de copiar código Pix está disponível
    await expect(page.locator('button:has-text("Copiar Código")')).toBeVisible();
    
    // Verificar se fomos redirecionados para a página de confirmação
    await expect(page).toHaveURL(/.*\/pedido-confirmado/);
  });
  
  test('deve aplicar cupom de desconto', async ({ page }) => {
    // Navegar para um curso e adicionar ao carrinho
    await page.goto('/cursos');
    await page.click('.curso-card:first-child a');
    await page.click('button:has-text("Comprar")');
    await page.click('a:has-text("Ver carrinho")');
    
    // Verificar se o campo de cupom está disponível
    await expect(page.locator('input[name="coupon"]')).toBeVisible();
    
    // Guardar o valor total antes do cupom
    const precoOriginal = await page.locator('.carrinho-total').textContent();
    
    // Aplicar cupom de teste
    await page.fill('input[name="coupon"]', 'TESTE10');
    await page.click('button:has-text("Aplicar")');
    
    // Verificar se a mensagem de sucesso do cupom aparece
    await expect(page.locator('.cupom-aplicado')).toBeVisible();
    await expect(page.locator('.cupom-aplicado')).toContainText('TESTE10');
    
    // Verificar se o valor foi atualizado com desconto
    const precoComDesconto = await page.locator('.carrinho-total').textContent();
    expect(precoOriginal).not.toEqual(precoComDesconto);
    
    // Prosseguir para o checkout
    await page.click('button:has-text("Finalizar Compra")');
    
    // Verificar se o desconto está refletido na página de checkout
    await expect(page.locator('.checkout-desconto')).toBeVisible();
    await expect(page.locator('.checkout-cupom')).toContainText('TESTE10');
  });
  
  test('deve exibir erro para cupom inválido', async ({ page }) => {
    // Navegar para um curso e adicionar ao carrinho
    await page.goto('/cursos');
    await page.click('.curso-card:first-child a');
    await page.click('button:has-text("Comprar")');
    await page.click('a:has-text("Ver carrinho")');
    
    // Verificar se o campo de cupom está disponível
    await expect(page.locator('input[name="coupon"]')).toBeVisible();
    
    // Aplicar cupom inválido
    await page.fill('input[name="coupon"]', 'CUPOMINVALIDO');
    await page.click('button:has-text("Aplicar")');
    
    // Verificar se a mensagem de erro aparece
    await expect(page.locator('.cupom-erro')).toBeVisible();
    await expect(page.locator('.cupom-erro')).toContainText('Cupom inválido');
  });
}); 