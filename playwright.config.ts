import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

/**
 * Configuração do Playwright
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Diretório onde os testes serão executados
  testDir: './tests',

  // Número máximo de falhas permitidas antes de parar a execução
  maxFailures: 5,

  // Timeout para cada teste em milissegundos
  timeout: 30000,

  // Padrão para ignorar caracteres de quebra de linha ao comparar outputs
  expect: {
    timeout: 5000,
    toMatchSnapshot: { threshold: 0.2 },
  },

  // Executar todos os testes em paralelo
  fullyParallel: true,

  // Falhar rapidamente na primeira falha de teste
  forbidOnly: !!process.env.CI,

  // Número de tentativas para cada teste
  retries: process.env.CI ? 2 : 0,

  // Reporters para a saída dos testes
  reporter: [
    ['html', { open: 'never' }],
    ['list', { printSteps: true }],
  ],

  // Compartilhar contexto de navegador entre testes - false para isolamento
  use: {
    // Tamanho da tela base
    viewport: { width: 1280, height: 720 },

    // Configuração de navegação
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173',

    // Capturar screenshot em caso de falha
    screenshot: 'only-on-failure',

    // Gravar vídeo em caso de falha
    video: 'on-first-retry',

    // Rastrear ações do usuário para depuração
    trace: 'on-first-retry',
  },

  // Configuração dos projetos (navegadores)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Testes para dispositivos móveis
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Servidor de desenvolvimento - inicia junto com os testes
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
}); 