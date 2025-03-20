import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCircle, Settings, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Links de navegação para manter consistência
const navigationLinks = [
  { path: "/cursos", label: "Cursos" },
  { path: "/sobre", label: "Sobre" },
  { path: "/associar", label: "Associe-se" },
  { path: "/contato", label: "Contato" },
];

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, profile, logout } = useAuth();
  
  // Função auxiliar para verificar se o link está ativo
  const isLinkActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          AssociaçãoPro
        </Link>

        {/* Botão do menu mobile */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu de navegação desktop */}
        <nav className="hidden md:flex space-x-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "transition-colors",
                isLinkActive(link.path)
                  ? "text-primary font-medium"
                  : "text-gray-600 hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50 pt-20">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-lg py-2 border-b border-gray-100",
                    isLinkActive(link.path)
                      ? "text-primary font-medium"
                      : "text-gray-600"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Adicionar botões de acesso ao menu mobile */}
              <div className="mt-4">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/cursos/meus" 
                      className="block py-2 text-lg text-primary font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Minha Área
                    </Link>
                    <button 
                      className="flex items-center py-2 text-lg text-red-500"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut size={18} className="mr-2" />
                      Sair
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="block py-2 text-lg text-primary font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botões de acesso */}
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Link to="/admin/dashboard" className="mr-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                title="Área Administrativa"
              >
                <Settings size={18} />
              </Button>
            </Link>
          )}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <UserCircle size={18} />
                  <span className="max-w-[100px] truncate">
                    {profile?.name || "Minha Área"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/cursos/meus">Meus Cursos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/certificados">Certificados</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/credencial">Credencial</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pagamentos">Pagamentos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut size={16} className="mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="flex items-center gap-2">
                <UserCircle size={18} />
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
