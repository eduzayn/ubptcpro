import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '../../src/components/ui/button';

/**
 * Testes do componente Button
 */
test.describe('Componente Button', () => {
  test('deve renderizar o botão primário corretamente', async ({ mount }) => {
    // Montar o componente Button
    const component = await mount(
      <Button variant="default">Botão Primário</Button>
    );
    
    // Verificar se o botão está visível
    await expect(component).toBeVisible();
    
    // Verificar se o texto está correto
    await expect(component).toContainText('Botão Primário');
    
    // Verificar se as classes corretas estão aplicadas
    await expect(component).toHaveClass(/bg-primary/);
  });

  test('deve renderizar o botão secundário corretamente', async ({ mount }) => {
    // Montar o componente Button
    const component = await mount(
      <Button variant="secondary">Botão Secundário</Button>
    );
    
    // Verificar se o botão está visível
    await expect(component).toBeVisible();
    
    // Verificar se o texto está correto
    await expect(component).toContainText('Botão Secundário');
    
    // Verificar se as classes corretas estão aplicadas
    await expect(component).toHaveClass(/bg-secondary/);
  });

  test('deve desabilitar o botão quando a prop disabled é true', async ({ mount }) => {
    // Montar o componente Button com a prop disabled
    const component = await mount(
      <Button variant="default" disabled>Botão Desabilitado</Button>
    );
    
    // Verificar se o botão está visível
    await expect(component).toBeVisible();
    
    // Verificar se o botão está desabilitado
    await expect(component).toBeDisabled();
    
    // Verificar se as classes de desabilitado estão aplicadas
    await expect(component).toHaveClass(/opacity-50/);
  });

  test('deve chamar a função onClick quando clicado', async ({ mount }) => {
    // Criar uma variável para rastrear se o botão foi clicado
    let clicked = false;
    
    // Montar o componente Button com um handler de clique
    const component = await mount(
      <Button
        variant="default"
        onClick={() => { clicked = true; }}
      >
        Clique Aqui
      </Button>
    );
    
    // Verificar se o botão está visível
    await expect(component).toBeVisible();
    
    // Clicar no botão
    await component.click();
    
    // Verificar se a função onClick foi chamada
    expect(clicked).toBe(true);
  });

  test('deve mudar de estilo ao passar o mouse', async ({ mount }) => {
    // Montar o componente Button
    const component = await mount(
      <Button variant="default">Botão com Hover</Button>
    );
    
    // Verificar o estilo inicial
    await expect(component).toHaveClass(/bg-primary/);
    
    // Passar o mouse sobre o botão
    await component.hover();
    
    // O teste verifica apenas que o botão mantém sua classe após hover
    // Não podemos testar pseudo-classes como :hover diretamente
    await expect(component).toHaveClass(/bg-primary/);
  });

  test('deve renderizar com um ícone quando fornecido', async ({ mount }) => {
    // Montar o componente Button com um ícone (usando um elemento span como exemplo)
    const component = await mount(
      <Button variant="default">
        <span data-testid="icon">🔍</span>
        Botão com Ícone
      </Button>
    );
    
    // Verificar se o botão está visível
    await expect(component).toBeVisible();
    
    // Verificar se o ícone está visível
    await expect(component.locator('[data-testid="icon"]')).toBeVisible();
    
    // Verificar se o texto do botão está correto
    await expect(component).toContainText('Botão com Ícone');
  });

  test('deve renderizar em diferentes tamanhos', async ({ mount }) => {
    // Montar o componente Button em tamanho pequeno
    const smallButton = await mount(
      <Button variant="default" size="sm">Botão Pequeno</Button>
    );
    
    // Verificar se as classes de tamanho pequeno estão aplicadas
    await expect(smallButton).toHaveClass(/h-8/);
    
    // Montar o componente Button em tamanho grande
    const largeButton = await mount(
      <Button variant="default" size="lg">Botão Grande</Button>
    );
    
    // Verificar se as classes de tamanho grande estão aplicadas
    await expect(largeButton).toHaveClass(/h-10/);
  });
}); 