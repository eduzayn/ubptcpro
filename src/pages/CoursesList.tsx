import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader, EmptyState } from "@/components/ui/loader";
import { useDataQuery } from "@/hooks/useQueryProvider";
import { executeQuery } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { Package } from "lucide-react";

// Função para buscar cursos no Supabase
async function fetchCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export default function CoursesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Usando o hook personalizado para buscar cursos
  const { data: courses, isLoading, error } = useDataQuery("courses", fetchCourses);
  
  // Filtrar cursos com base nos filtros
  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Extrair categorias únicas dos cursos para o filtro
  const categories = courses 
    ? [...new Set(courses.map((course) => course.category))]
    : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Nossos Cursos</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore nossos cursos especializados em terapias complementares para profissionais de saúde.
        </p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <Label htmlFor="search">Buscar cursos</Label>
          <Input
            id="search"
            placeholder="Digite para buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category as React.Key} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estado de carregamento */}
      {isLoading && (
        <Loader text="Carregando cursos..." className="py-8" />
      )}

      {/* Estado de erro */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar cursos. Tente novamente mais tarde.</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Lista de cursos */}
      {!isLoading && !error && (
        <>
          {filteredCourses?.length === 0 ? (
            <EmptyState 
              title="Nenhum curso encontrado" 
              description="Tente ajustar seus filtros de busca."
              icon={<Package size={48} className="text-gray-400" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses?.map((course) => (
                <Link to={`/cursos/${course.id}`} key={course.id}>
                  <Card className="h-full transition-transform hover:scale-[1.02]">
                    {course.image_url && (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={course.image_url}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-gray-600">
                        {course.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div>
                        {course.is_free ? (
                          <span className="text-green-600 font-medium">Gratuito</span>
                        ) : (
                          <span className="font-medium">
                            R$ {Number(course.price).toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </div>
                      <Button variant="outline">Ver detalhes</Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
