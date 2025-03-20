import { test, expect } from '@playwright/test';

/**
 * Testes para API de cursos
 * Estes testes verificam o comportamento da API ao interagir com os cursos
 */
test.describe('API de Cursos', () => {
  let authToken: string;
  
  // Antes de todos os testes, obter um token de autenticação
  test.beforeAll(async ({ request }) => {
    // Fazer login para obter token
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: 'admin@exemplo.com',
        password: 'senha_admin123'
      }
    });
    
    expect(loginResponse.ok()).toBeTruthy();
    const responseBody = await loginResponse.json();
    authToken = responseBody.token;
    expect(authToken).toBeTruthy();
  });
  
  test('deve listar todos os cursos', async ({ request }) => {
    // Fazer requisição para listar cursos
    const response = await request.get('/api/courses');
    
    // Verificar se a resposta foi bem-sucedida
    expect(response.ok()).toBeTruthy();
    
    // Verificar o formato dos dados retornados
    const courses = await response.json();
    expect(Array.isArray(courses)).toBeTruthy();
    expect(courses.length).toBeGreaterThan(0);
    
    // Verificar a estrutura do primeiro curso
    const firstCourse = courses[0];
    expect(firstCourse).toHaveProperty('id');
    expect(firstCourse).toHaveProperty('title');
    expect(firstCourse).toHaveProperty('description');
    expect(firstCourse).toHaveProperty('price');
    expect(firstCourse).toHaveProperty('imageUrl');
  });
  
  test('deve buscar um curso por ID', async ({ request }) => {
    // Primeiro, listar os cursos para obter um ID válido
    const listResponse = await request.get('/api/courses');
    const courses = await listResponse.json();
    const courseId = courses[0].id;
    
    // Buscar o curso específico
    const response = await request.get(`/api/courses/${courseId}`);
    
    // Verificar se a resposta foi bem-sucedida
    expect(response.ok()).toBeTruthy();
    
    // Verificar os dados do curso
    const course = await response.json();
    expect(course).toHaveProperty('id', courseId);
    expect(course).toHaveProperty('title');
    expect(course).toHaveProperty('description');
    expect(course).toHaveProperty('price');
    expect(course).toHaveProperty('imageUrl');
    expect(course).toHaveProperty('modules');
    expect(Array.isArray(course.modules)).toBeTruthy();
  });
  
  test('deve retornar 404 para curso inexistente', async ({ request }) => {
    // Tentar buscar um curso com ID inválido
    const response = await request.get('/api/courses/9999999');
    
    // Verificar se a resposta foi 404
    expect(response.status()).toBe(404);
    
    // Verificar a mensagem de erro
    const error = await response.json();
    expect(error).toHaveProperty('message', 'Curso não encontrado');
  });
  
  test('deve criar um novo curso (requer autenticação)', async ({ request }) => {
    // Dados para o novo curso
    const newCourse = {
      title: 'Curso de Teste Playwright',
      description: 'Aprenda a testar aplicações com Playwright',
      price: 199.99,
      category: 'tecnologia',
      imageUrl: 'https://example.com/image.jpg'
    };
    
    // Fazer requisição para criar curso
    const response = await request.post('/api/courses', {
      data: newCourse,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verificar se a resposta foi bem-sucedida
    expect(response.ok()).toBeTruthy();
    
    // Verificar o curso criado
    const course = await response.json();
    expect(course).toHaveProperty('id');
    expect(course).toHaveProperty('title', newCourse.title);
    expect(course).toHaveProperty('description', newCourse.description);
    expect(course).toHaveProperty('price', newCourse.price);
    expect(course).toHaveProperty('category', newCourse.category);
    
    // Salvar o ID para uso posterior
    return course.id;
  });
  
  test('deve atualizar um curso existente (requer autenticação)', async ({ request }) => {
    // Primeiro, criar um curso para atualizar
    const newCourse = {
      title: 'Curso para Atualizar',
      description: 'Este curso será atualizado',
      price: 99.99,
      category: 'educacao',
      imageUrl: 'https://example.com/temp.jpg'
    };
    
    // Criar o curso
    const createResponse = await request.post('/api/courses', {
      data: newCourse,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const createdCourse = await createResponse.json();
    const courseId = createdCourse.id;
    
    // Dados atualizados
    const updatedData = {
      title: 'Curso Atualizado',
      description: 'Descrição atualizada com sucesso',
      price: 149.99
    };
    
    // Atualizar o curso
    const updateResponse = await request.put(`/api/courses/${courseId}`, {
      data: updatedData,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verificar se a resposta foi bem-sucedida
    expect(updateResponse.ok()).toBeTruthy();
    
    // Verificar o curso atualizado
    const updatedCourse = await updateResponse.json();
    expect(updatedCourse).toHaveProperty('id', courseId);
    expect(updatedCourse).toHaveProperty('title', updatedData.title);
    expect(updatedCourse).toHaveProperty('description', updatedData.description);
    expect(updatedCourse).toHaveProperty('price', updatedData.price);
    
    // A categoria não foi alterada
    expect(updatedCourse).toHaveProperty('category', newCourse.category);
  });
  
  test('deve excluir um curso (requer autenticação)', async ({ request }) => {
    // Primeiro, criar um curso para excluir
    const courseToDelete = {
      title: 'Curso para Excluir',
      description: 'Este curso será excluído',
      price: 49.99,
      category: 'teste',
      imageUrl: 'https://example.com/delete.jpg'
    };
    
    // Criar o curso
    const createResponse = await request.post('/api/courses', {
      data: courseToDelete,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const createdCourse = await createResponse.json();
    const courseId = createdCourse.id;
    
    // Excluir o curso
    const deleteResponse = await request.delete(`/api/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verificar se a exclusão foi bem-sucedida
    expect(deleteResponse.ok()).toBeTruthy();
    
    // Verificar se o curso foi realmente excluído tentando buscá-lo
    const getResponse = await request.get(`/api/courses/${courseId}`);
    expect(getResponse.status()).toBe(404);
  });
  
  test('deve falhar ao criar curso sem autenticação', async ({ request }) => {
    // Dados para o novo curso
    const newCourse = {
      title: 'Curso Sem Autenticação',
      description: 'Tentativa de criar curso sem autenticação',
      price: 99.99,
      category: 'teste'
    };
    
    // Tentar criar curso sem token
    const response = await request.post('/api/courses', {
      data: newCourse
    });
    
    // Verificar se a resposta foi um erro de autenticação
    expect(response.status()).toBe(401);
    
    // Verificar a mensagem de erro
    const error = await response.json();
    expect(error).toHaveProperty('message', 'Não autorizado');
  });
}); 