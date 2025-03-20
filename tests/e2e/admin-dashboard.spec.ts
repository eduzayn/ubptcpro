import { test, expect } from '@playwright/test';
import { loginAs, logout } from '../utils/auth-helpers';

/**
 * Testes para o painel de administração
 */
test.describe('Painel de Administração', () => {
  
  // Antes de cada teste, fazer login como administrador
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
    
    // Navegar para o painel de administração
    await page.goto('/admin/dashboard');
    
    // Verificar se estamos na página correta
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
    await expect(page.locator('h1:has-text("Painel Administrativo")')).toBeVisible();
  });
  
  // Após cada teste, fazer logout
  test.afterEach(async ({ page }) => {
    await logout(page);
  });
  
  test('deve exibir estatísticas gerais no dashboard', async ({ page }) => {
    // Verificar se os cards de estatísticas estão visíveis
    const estatisticasCount = await page.locator('.estatisticas-card').count();
    expect(estatisticasCount).toBeGreaterThanOrEqual(3);
    
    // Verificar se os títulos dos cards existem
    await expect(page.locator('.estatisticas-card:has-text("Usuários")')).toBeVisible();
    await expect(page.locator('.estatisticas-card:has-text("Cursos")')).toBeVisible();
    await expect(page.locator('.estatisticas-card:has-text("Vendas")')).toBeVisible();
    
    // Verificar se os valores nos cards são números
    const usuariosValue = await page.locator('.estatisticas-card:has-text("Usuários") .valor').textContent();
    expect(Number(usuariosValue?.replace(/\D/g, ''))).toBeGreaterThan(0);
  });
  
  test('deve listar usuários na seção de gerenciamento de usuários', async ({ page }) => {
    // Navegar para a página de gerenciamento de usuários
    await page.click('a:has-text("Gerenciar Usuários")');
    
    // Verificar se estamos na página correta
    await expect(page).toHaveURL(/.*\/admin\/usuarios/);
    
    // Verificar se a tabela de usuários está visível
    await expect(page.locator('table.usuarios-table')).toBeVisible();
    
    // Verificar se existem usuários na tabela
    const usuariosCount = await page.locator('table.usuarios-table tbody tr').count();
    expect(usuariosCount).toBeGreaterThanOrEqual(1);
    
    // Verificar se as colunas da tabela estão corretas
    await expect(page.locator('table.usuarios-table th:has-text("Nome")')).toBeVisible();
    await expect(page.locator('table.usuarios-table th:has-text("Email")')).toBeVisible();
    await expect(page.locator('table.usuarios-table th:has-text("Perfil")')).toBeVisible();
    await expect(page.locator('table.usuarios-table th:has-text("Ações")')).toBeVisible();
  });
  
  test('deve permitir buscar usuários', async ({ page }) => {
    // Navegar para a página de gerenciamento de usuários
    await page.click('a:has-text("Gerenciar Usuários")');
    
    // Verificar se o campo de busca está visível
    await expect(page.locator('input[placeholder*="Buscar usuário"]')).toBeVisible();
    
    // Contar quantos usuários existem inicialmente
    const initialCount = await page.locator('table.usuarios-table tbody tr').count();
    
    // Realizar uma busca por "admin"
    await page.fill('input[placeholder*="Buscar usuário"]', 'admin');
    await page.press('input[placeholder*="Buscar usuário"]', 'Enter');
    
    // Aguardar a atualização da tabela
    await page.waitForTimeout(500);
    
    // Verificar se a tabela foi filtrada
    const filteredCount = await page.locator('table.usuarios-table tbody tr').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Verificar se os resultados contêm o termo buscado
    const primeiroResultado = await page.locator('table.usuarios-table tbody tr').first();
    await expect(primeiroResultado).toContainText(/admin/i);
  });
  
  test('deve permitir editar um usuário', async ({ page }) => {
    // Navegar para a página de gerenciamento de usuários
    await page.click('a:has-text("Gerenciar Usuários")');
    
    // Clicar no botão de editar do primeiro usuário
    await page.click('table.usuarios-table tbody tr:first-child button:has-text("Editar")');
    
    // Verificar se o modal de edição aparece
    await expect(page.locator('.modal-usuario')).toBeVisible();
    await expect(page.locator('.modal-usuario h2:has-text("Editar Usuário")')).toBeVisible();
    
    // Verificar se os campos estão preenchidos
    await expect(page.locator('.modal-usuario input[name="name"]')).toHaveValue(/./);
    await expect(page.locator('.modal-usuario input[name="email"]')).toHaveValue(/./);
    
    // Mudar o perfil do usuário
    await page.selectOption('.modal-usuario select[name="role"]', 'instructor');
    
    // Salvar as alterações
    await page.click('.modal-usuario button:has-text("Salvar")');
    
    // Verificar se o modal fechou
    await expect(page.locator('.modal-usuario')).not.toBeVisible();
    
    // Verificar se aparece mensagem de sucesso
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('.toast-success')).toContainText('Usuário atualizado');
  });
  
  test('deve permitir gerenciar cursos', async ({ page }) => {
    // Navegar para a página de gerenciamento de cursos
    await page.click('a:has-text("Gerenciar Cursos")');
    
    // Verificar se estamos na página correta
    await expect(page).toHaveURL(/.*\/admin\/cursos/);
    
    // Verificar se a tabela de cursos está visível
    await expect(page.locator('table.cursos-table')).toBeVisible();
    
    // Verificar se o botão de adicionar curso está visível
    await expect(page.locator('button:has-text("Adicionar Curso")')).toBeVisible();
    
    // Verificar se existem cursos na tabela
    const cursosCount = await page.locator('table.cursos-table tbody tr').count();
    expect(cursosCount).toBeGreaterThanOrEqual(1);
    
    // Clicar no botão de adicionar curso
    await page.click('button:has-text("Adicionar Curso")');
    
    // Verificar se o formulário de novo curso aparece
    await expect(page.locator('.modal-curso')).toBeVisible();
    await expect(page.locator('.modal-curso h2:has-text("Novo Curso")')).toBeVisible();
    
    // Preencher os dados do novo curso
    await page.fill('.modal-curso input[name="title"]', 'Curso de Teste Automatizado');
    await page.fill('.modal-curso textarea[name="description"]', 'Descrição do curso de teste criado via automação');
    await page.fill('.modal-curso input[name="price"]', '199.90');
    await page.selectOption('.modal-curso select[name="category"]', 'tecnologia');
    
    // Cancelar a operação (para não criar o curso no banco)
    await page.click('.modal-curso button:has-text("Cancelar")');
    
    // Verificar se o modal fechou
    await expect(page.locator('.modal-curso')).not.toBeVisible();
  });
  
  test('deve exibir relatórios financeiros', async ({ page }) => {
    // Navegar para a página de relatórios
    await page.click('a:has-text("Relatórios")');
    
    // Verificar se estamos na página correta
    await expect(page).toHaveURL(/.*\/admin\/relatorios/);
    
    // Verificar se o gráfico de vendas está visível
    await expect(page.locator('.grafico-vendas')).toBeVisible();
    
    // Verificar se os filtros de data estão disponíveis
    const filtrosDataCount = await page.locator('input[type="date"]').count();
    expect(filtrosDataCount).toBe(2);
    
    // Verificar se o botão de exportar relatório está disponível
    await expect(page.locator('button:has-text("Exportar Relatório")')).toBeVisible();
    
    // Verificar se a tabela de transações está visível
    await expect(page.locator('table.transacoes-table')).toBeVisible();
    const transacoesCount = await page.locator('table.transacoes-table tbody tr').count();
    expect(transacoesCount).toBeGreaterThanOrEqual(1);
  });
}); 