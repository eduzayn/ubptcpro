# Estrutura de Testes - UBPTC Pro

Este diretório contém os testes automatizados para a aplicação UBPTC Pro, organizados por categorias e utilizando o framework Playwright.

## Estrutura de Diretórios

```
tests/
├── e2e/               # Testes de ponta a ponta (end-to-end)
│   ├── navigation.spec.ts     # Navegação básica do site
│   └── checkout.spec.ts       # Processo de checkout e pagamento
├── components/        # Testes de componentes específicos
│   └── Header.spec.ts         # Testes para o componente Header
├── auth/              # Testes relacionados à autenticação
│   └── login.spec.ts          # Testes de login e recuperação de senha
└── api/               # Testes para as APIs da aplicação
    └── courses.spec.ts        # Testes para a API de cursos
```

## Tipos de Testes

### E2E (End-to-End)

Testes que simulam o comportamento do usuário em fluxos completos da aplicação, como navegação pelo site e processo de checkout.

### Componentes

Testes de componentes individuais da interface, verificando comportamentos específicos e sua reatividade.

### Autenticação

Testes focados nos fluxos de autenticação, como login, registro e recuperação de senha.

### API

Testes para os endpoints da API, verificando respostas, formatos de dados e comportamento com diferentes parâmetros.

## Como Executar os Testes

### Todos os testes
```bash
npm test
```

### Testes específicos por categoria
```bash
npm run test:e2e       # Testes de ponta a ponta
npm run test:components # Testes de componentes
npm run test:auth      # Testes de autenticação
npm run test:api       # Testes de API
```

### Ferramentas de desenvolvimento
```bash
npm run test:ui        # Abre a interface visual do Playwright para execução de testes
npm run test:debug     # Executa os testes em modo debug
npm run test:report    # Mostra o relatório dos últimos testes executados
```

## Configuração

A configuração principal do Playwright está no arquivo `playwright.config.ts` na raiz do projeto, que define:

- Navegadores para testes (Chromium, Firefox, WebKit, dispositivos móveis)
- Timeouts e configurações de paralelismo
- Configurações para capturas de tela e vídeos
- Servidor de desenvolvimento para testes

## Melhores Práticas para Criar Novos Testes

1. **Isolamento**: Cada teste deve ser independente e não depender do estado de outros testes.
2. **Seletores Estáveis**: Use seletores que não mudam frequentemente (preferível por roles, texto ou data-testid).
3. **Assertivas Claras**: Cada teste deve verificar comportamentos específicos com assertivas claras.
4. **Organização por Funcionalidade**: Agrupe testes relacionados usando `test.describe()`.
5. **Setup Comum**: Use `test.beforeEach()` para configuração repetitiva.
6. **Usuários de Teste**: Use contas de teste específicas para testes automatizados.
7. **Limpeza**: Use `test.afterEach()` ou `test.afterAll()` para limpar recursos quando necessário.

## Dados de Teste

Para testes que exigem autenticação, usamos usuários de teste específicos:
- Cliente: cliente_teste@exemplo.com / senha123
- Admin: admin@exemplo.com / senha_admin123

**Importante**: Nunca use dados de produção ou informações sensíveis nos testes automatizados.

## Integração Contínua

Os testes são executados automaticamente em pull requests e após merges para a branch principal, utilizando o sistema de CI configurado no projeto. 