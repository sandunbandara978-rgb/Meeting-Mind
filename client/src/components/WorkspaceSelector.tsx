import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../types';
import { Building2, ChevronDown, Users, ShieldCheck, UserCheck, Shield } from 'lucide-react';

export const WorkspaceSelector: React.FC = () => {
  const { 
    workspaces, 
    activeWorkspaceId, 
    setActiveWorkspaceId, 
    activeTeamId, 
    setActiveTeamId, 
    user, 
    setRole 
  } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const roles: Array<{ id: UserRole; label: string; color: string }> = [
    { id: 'EMPLOYEE', label: 'Employee', color: 'bg-slate-100 text-slate-800 border-slate-200' },
    { id: 'MANAGER', label: 'Team Manager', color: 'bg-slate-100 text-slate-900 border-slate-300 font-bold' },
    { id: 'ADMIN', label: 'System Admin', color: 'bg-slate-900 text-white border-slate-900 font-bold' }
  ];

  return (
    <div className="flex items-center space-x-3">
      {/* Workspace Switcher */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold shadow-2xs transition-all"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="max-w-[140px] truncate">{currentWorkspace.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Switch Workspace
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setActiveWorkspaceId(ws.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                  activeWorkspaceId === ws.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-gray-100'
                }`}
              >
                <span>{ws.name}</span>
                <span className={`text-[10px] font-mono ${activeWorkspaceId === ws.id ? 'text-slate-300' : 'text-slate-400'}`}>{ws.teams.length} teams</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Team Filter */}
      <div className="hidden lg:flex items-center space-x-1.5 bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs shadow-2xs">
        <Users className="w-3.5 h-3.5 text-slate-400" />
        <select
          value={activeTeamId}
          onChange={(e) => setActiveTeamId(e.target.value)}
          className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
        >
          <option value="ALL" className="bg-white text-slate-800">All Teams</option>
          {currentWorkspace.teams.map((t) => (
            <option key={t.id} value={t.id} className="bg-white text-slate-800">
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Interactive Role Switcher Pill */}
      <div className="relative">
        <button
          onClick={() => setIsRoleOpen(!isRoleOpen)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-2xs ${
            roles.find(r => r.id === user?.role)?.color || 'bg-slate-100 text-slate-800 border-slate-200'
          }`}
          title="Switch RBAC Role to test permissions"
        >
          <Shield className="w-3 h-3" />
          <span>Role: {user?.role}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {isRoleOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Switch Test Role
            </div>
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  setIsRoleOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  user?.role === r.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-gray-100'
                }`}
              >
                <span>{r.label}</span>
                {user?.role === r.id && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
