import { beforeMount, afterMount } from '@playwright/experimental-ct-react/hooks';
import '../src/index.css';

beforeMount(async ({ hooksConfig }) => {
  console.log('Configurando componentes para teste...');
});

afterMount(async ({ hooksConfig }) => {
  console.log('Componente montado com sucesso');
}); 