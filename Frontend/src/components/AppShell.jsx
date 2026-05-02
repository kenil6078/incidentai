import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useSocket } from "../context/SocketContext";
import { useNotification } from "../features/notification/hooks/useNotification";
import {
  LayoutDashboard, AlertTriangle, Activity, Users, BarChart3, Settings, Bell, LogOut,
  Globe, Plus, Wifi, WifiOff, Menu, X, CreditCard, MessageSquare,
} from "lucide-react";
import { formatRelative } from "../components/Badges";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NavItem = ({ to, icon: Icon, label, end, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    data-testid={`nav-${label.toLowerCase().replace(/\s/g, '-')}`}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 text-sm transition-all mx-2 rounded-none mb-1 ${
        isActive
          ? "bg-[#FF6B6B] border-2 border-black neo-shadow text-black font-bold"
          : "border-2 border-transparent hover:border-black text-black hover:bg-white font-semibold"
      }`
    }
  >
    <Icon className="w-4 h-4" strokeWidth={2} />
    {label}
  </NavLink>
);

export default function AppShell({ children }) {
  const { user, handleLogout } = useAuth();
  const { unreadCounts } = useSelector((state) => state.chat);
  const { connected, subscribe } = useSocket();
  const { notifications: notifs, unreadCount: unread, getNotifications, readAll: markAllRead, addNotification } = useNotification();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  useEffect(() => {
    const unsub = subscribe?.((evt) => {
      if (evt.type === "notification" || evt.eventName === "notification") {
        addNotification(evt.data || evt);
      } else if (evt.type === "incident.created" || evt.type === "incident.updated") {
        getNotifications();
      }
    });
    return () => unsub && unsub();
  }, [subscribe, addNotification, getNotifications]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex relative overflow-hidden h-screen">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-[#D4F4E4] border-r-2 border-black flex flex-col transition-transform duration-300 ease-in-out
        md:translate-x-0 
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
      `} data-testid="app-sidebar">
        <div className="px-5 py-5 border-b-2 border-black flex items-center justify-between">
          <Link 
            to={user.role === 'super_admin' ? '/admin' : '/dashboard'} 
            onClick={() => setShowSidebar(false)} 
            className="flex items-center gap-2 group" 
            data-testid="brand-logo"
          >
            <div className="w-7 h-7 bg-[#FF6B6B] border-2 border-black neo-shadow flex items-center justify-center">
              <span className="text-white font-black text-sm">i</span>
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-zinc-950">incident.ai</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono">
                {user.role === 'super_admin' ? 'Platform Control' : user.org_name}
              </div>
            </div>
          </Link>
          <button onClick={() => setShowSidebar(false)} className="md:hidden text-zinc-500 hover:text-zinc-950">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {user.role === 'super_admin' ? (
            <NavItem to="/admin" icon={LayoutDashboard} label="Admin Dashboard" end onClick={() => setShowSidebar(false)} />
          ) : (
            <>
              <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" end onClick={() => setShowSidebar(false)} />
              <NavItem to="/incidents" icon={AlertTriangle} label="Incidents" onClick={() => setShowSidebar(false)} />
              <div className="relative">
                <NavItem to="/chats" icon={MessageSquare} label="Chat" onClick={() => setShowSidebar(false)} />
                {Object.values(unreadCounts || {}).reduce((a, b) => a + b, 0) > 0 && (
                  <span className="absolute left-[38px] top-2 w-2 h-2 bg-[#FF6B6B] border border-black rounded-full z-10" />
                )}
              </div>
              <NavItem to="/services" icon={Activity} label="Services" onClick={() => setShowSidebar(false)} />
              <NavItem to="/team" icon={Users} label="Team" onClick={() => setShowSidebar(false)} />
              <NavItem to="/analytics" icon={BarChart3} label="Analytics" onClick={() => setShowSidebar(false)} />
              <NavItem to="/billing" icon={CreditCard} label="Billing" onClick={() => setShowSidebar(false)} />
              <NavItem to="/settings" icon={Settings} label="Settings" onClick={() => setShowSidebar(false)} />
            </>
          )}
        </nav>

        <div className="border-t-2 border-black p-3 space-y-2 bg-[#FDE68A]">
          {user.role !== 'super_admin' && (
            <a
              href={`/status/${user.org_name?.toLowerCase().replace(/\s/g, '-')}`}
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-950 px-2 py-1"
              data-testid="public-status-link"
            >
              <Globe className="w-3 h-3" /> Public Status Page
            </a>
          )}
          <div className="flex items-center gap-2 px-2 py-1 text-xs font-mono text-zinc-500">
            {connected ? (
              <><Wifi className="w-3 h-3 text-green-600" /> realtime: ON</>
            ) : (
              <><WifiOff className="w-3 h-3 text-zinc-400" /> realtime: OFF</>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-60 h-screen">
        <header className="h-14 bg-[#FDE68A] border-b-2 border-black flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSidebar(true)} 
              className="md:hidden p-2 -ml-2 text-zinc-600 hover:text-zinc-950"
            >
              <Menu className="w-5 h-5" />
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate("/incidents/new")}
                className="neo-shadow bg-[#FF6B6B] text-black border-2 border-black text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1.5 transition flex items-center gap-1.5"
                data-testid="new-incident-button-header"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={3} /> New Incident
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative w-9 h-9 flex items-center justify-center hover:bg-zinc-100"
                  data-testid="notifications-button"
                >
                  <Bell className="w-4 h-4 text-zinc-700" />
                  {unread > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full pulse-dot" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-none">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-950" data-testid="mark-all-read">
                      Mark all read
                    </button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  {notifs.length === 0 ? (
                    <div className="px-3 py-6 text-center text-xs text-zinc-500">No notifications</div>
                  ) : (
                    notifs.map((n) => (
                      <DropdownMenuItem
                        key={n.id || n._id}
                        onClick={() => {
                          const targetId = n.incidentId || n.incident_id;
                          if (targetId) navigate(`/incidents/${targetId}`);
                        }}
                        className="flex flex-col items-start gap-1 py-2"
                        data-testid={`notif-${n.id || n._id}`}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                          <span className="text-xs font-medium flex-1 truncate">{n.message}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">{formatRelative(n.created_at || n.createdAt)}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-zinc-100 px-2 py-1" data-testid="user-menu-button">
                  <div className="w-7 h-7 bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-semibold text-zinc-950">{user.name}</div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{user.role}</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-none w-48">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")} data-testid="menu-settings">
                  <Settings className="w-3.5 h-3.5 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                  <LogOut className="w-3.5 h-3.5 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
