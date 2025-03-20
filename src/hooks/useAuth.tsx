import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthService, User } from "@/services/auth.service";
import { useToast } from "@/components/ui/use-toast";

// Definição do tipo de contexto de autenticação
interface AuthContextType {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<void>;
}

// Criação do contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para o provedor de contexto
interface AuthProviderProps {
  children: ReactNode;
}

// Provedor de contexto de autenticação
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Verifica se o usuário está autenticado
  const isAuthenticated = !!user;
  
  // Verifica se o usuário é administrador (exemplo simples)
  // Em uma implementação real, isso seria baseado em uma propriedade do perfil
  const isAdmin = profile?.role === "admin";

  // Efeito para verificar a autenticação na inicialização
  useEffect(() => {
    async function loadUserFromSession() {
      try {
        setIsLoading(true);
        const { user: authUser, profile: userProfile } = await AuthService.getCurrentUser();
        
        if (authUser && userProfile) {
          setUser(authUser);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário da sessão:", error);
        toast({
          title: "Erro de autenticação",
          description: "Não foi possível verificar sua sessão",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserFromSession();
  }, [toast]);

  // Função para realizar login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user: authUser, profile: userProfile } = await AuthService.signIn(email, password);
      setUser(authUser);
      setProfile(userProfile);
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Falha no login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para realizar logout
  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthService.signOut();
      setUser(null);
      setProfile(null);
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao desconectar",
        description: "Ocorreu um problema ao tentar sair",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para registrar um novo usuário
  const register = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true);
      const { user: authUser, profile: userProfile } = await AuthService.signUp(email, password, userData);
      setUser(authUser);
      setProfile(userProfile);
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Seu cadastro foi criado e está pendente de aprovação",
      });
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast({
        title: "Falha no cadastro",
        description: "Não foi possível criar seu cadastro. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Valor do contexto que será disponibilizado
  const contextValue: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
} 