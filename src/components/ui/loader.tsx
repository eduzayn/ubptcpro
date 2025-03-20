import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: number;
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

/**
 * Componente de carregamento reutilizável
 * Pode ser usado em botões, páginas inteiras ou pequenos elementos
 */
export function Loader({ 
  size = 24, 
  className, 
  text, 
  fullScreen = false 
}: LoaderProps) {
  const loaderContent = (
    <div className={cn(
      "flex flex-col items-center justify-center", 
      fullScreen ? "min-h-screen" : "py-4",
      className
    )}>
      <Loader2 
        size={size} 
        className="animate-spin text-primary" 
      />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">
          {text}
        </p>
      )}
    </div>
  );

  // Se for fullScreen, renderiza em tela cheia
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        {loaderContent}
      </div>
    );
  }

  // Senão, renderiza como um elemento normal
  return loaderContent;
}

/**
 * Versão do loader para botões
 */
export function ButtonLoader({ size = 16, className }: Omit<LoaderProps, "text" | "fullScreen">) {
  return (
    <Loader2 
      size={size} 
      className={cn("animate-spin", className)} 
    />
  );
}

/**
 * Componente para mostrar um estado vazio ou quando não há dados
 */
export function EmptyState({ 
  title = "Nenhum dado encontrado", 
  description = "Não há dados para mostrar neste momento.",
  icon,
  className,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed", 
      className
    )}>
      {icon}
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
} 