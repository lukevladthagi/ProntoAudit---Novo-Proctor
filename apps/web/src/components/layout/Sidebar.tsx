'use client';

import { NavLink, useLocation } from '@/lib/router-shim';
import {
  LayoutDashboard,
  ClipboardCheck,
  PlayCircle,
  AlertTriangle,
  ListTodo,
  CheckCircle2,
  FileText,
  Building2,
  FolderTree,
  Settings,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from '@/lib/auth-client';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Auditorias', href: '/auditorias', icon: ClipboardCheck },
  { label: 'Execução', href: '/execucao', icon: PlayCircle },
  { label: 'Achados', href: '/achados', icon: AlertTriangle },
  { label: 'Planos de Ação', href: '/planos-acao', icon: ListTodo },
  { label: 'Verificação de Eficácia', href: '/verificacao', icon: CheckCircle2 },
  { label: 'Relatórios', href: '/relatorios', icon: FileText },
];

const cadastrosItems: NavItem[] = [
  { label: 'Unidades', href: '/cadastros/unidades', icon: Building2 },
  { label: 'Setores', href: '/cadastros/setores', icon: FolderTree },
  { label: 'Processos', href: '/cadastros/processos', icon: GitBranch },
  { label: 'Checklists', href: '/cadastros/checklists', icon: ClipboardCheck },
  { label: 'Usuários', href: '/cadastros/usuarios', icon: Users },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed: externalCollapsed, onToggle }: SidebarProps = {}) {
  const location = useLocation();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [cadastrosOpen, setCadastrosOpen] = useState(location.pathname.startsWith('/cadastros'));
  const { data: session } = useSession();

  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const handleToggle = () => {
    const newCollapsed = !collapsed;
    if (onToggle) {
      onToggle(newCollapsed);
    } else {
      setInternalCollapsed(newCollapsed);
    }
  };

  const handleLogout = async () => {
    await signOut();
    if (typeof window !== 'undefined') {
      window.location.href = '/account/signin';
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            'flex h-16 items-center border-b border-sidebar-border transition-all',
            collapsed ? 'justify-center px-2' : 'gap-3 px-4'
          )}
        >
          <div
            className={cn(
              'shrink-0 overflow-hidden rounded-md bg-white',
              collapsed ? 'h-10 w-10' : 'h-12 w-48'
            )}
          >
            <img
              src="/prontoaudit-logo.png"
              alt="ProntoAudit"
              className={cn(
                'h-full max-w-none object-cover object-left',
                collapsed ? 'w-28' : 'w-full object-contain'
              )}
            />
          </div>
          {!collapsed && (
            <span className="sr-only">ProntoAudit Auditoria Interna</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
          {!collapsed && (
            <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Principal
            </div>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg text-sm font-medium transition-colors',
                  collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          ))}

          {/* Cadastros Section */}
          {!collapsed && (
            <>
              <div className="mt-6 mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Cadastros
              </div>
              <button
                onClick={() => setCadastrosOpen(!cadastrosOpen)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4" />
                  Configurações
                </div>
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', cadastrosOpen && 'rotate-180')}
                />
              </button>
              {cadastrosOpen && (
                <div className="ml-4 space-y-1 border-l border-sidebar-border pl-3">
                  {cadastrosItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                            : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </>
          )}

          {collapsed && (
            <div className="mt-6 space-y-1">
              {cadastrosItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-center rounded-lg p-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    )
                  }
                  title={item.label}
                >
                  <item.icon className="h-4 w-4" />
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex flex-col overflow-hidden flex-1">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {session?.user?.name || 'Usuário'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {session?.user?.email || 'Equipe Qualidade'}
                </span>
              </div>
              <button
                onClick={() => {
                  void handleLogout();
                }}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className={cn(
              'w-full transition-all',
              collapsed ? 'justify-center px-0' : 'justify-start'
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Recolher Menu
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
