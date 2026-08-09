import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  UserPlus, 
  Settings,
  Sparkles
} from 'lucide-react';

export const AdminConsole: React.FC = () => {
  const usersList = [
    { id: 'u-1', name: 'කසුන් පෙරේරා', email: 'alex.vance@meetingmind.ai', role: 'MANAGER', status: 'ACTIVE', meetingsCount: 14 },
    { id: 'u-2', name: 'සාරා ජයසිංහ', email: 'sarah.j@meetingmind.ai', role: 'EMPLOYEE', status: 'ACTIVE', meetingsCount: 8 },
    { id: 'u-3', name: 'දිනුක ප්‍රනාන්දු', email: 'david.m@meetingmind.ai', role: 'EMPLOYEE', status: 'ACTIVE', meetingsCount: 6 },
    { id: 'u-4', name: 'ඉලේෂා වික්‍රමසිංහ', email: 'elena.r@meetingmind.ai', role: 'ADMIN', status: 'ACTIVE', meetingsCount: 19 }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Admin Console Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-slate-800" />
          System Administration & Governance
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Manage system users, organization subscriptions, permissions, and OpenAI token usage.
        </p>
      </div>

      {/* Top Admin KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Users</span>
            <Users className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">142</div>
          <p className="text-[11px] text-emerald-700 font-bold">Enterprise Tier Active</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span className="text-xs font-semibold uppercase tracking-wider">OpenAI API Tokens</span>
            <Cpu className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">1.48M</div>
          <p className="text-[11px] text-slate-500 font-medium">GPT-4o & Whisper v1 usage</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span className="text-xs font-semibold uppercase tracking-wider">Whisper Audio Hours</span>
            <Activity className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">320 hrs</div>
          <p className="text-[11px] text-emerald-700 font-bold">100% audio transcribed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Billing</span>
            <CreditCard className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">$4,850</div>
          <p className="text-[11px] text-slate-500 font-medium">Renews on Aug 1, 2026</p>
        </div>
      </div>

      {/* Main Admin Content: User Management Table */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">User Directory & Roles</h3>
          <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-all">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite User</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase font-bold tracking-wider text-slate-400 border-b border-gray-200/80">
              <tr>
                <th className="pb-3 px-2">User Name</th>
                <th className="pb-3 px-2">Email</th>
                <th className="pb-3 px-2">Role</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Meetings</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80">
                  <td className="py-3 px-2 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-2 text-slate-500">{u.email}</td>
                  <td className="py-3 px-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      u.role === 'ADMIN'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : u.role === 'MANAGER'
                        ? 'bg-slate-100 text-slate-900 border-slate-300'
                        : 'bg-gray-100 text-slate-700 border-gray-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-emerald-700 font-bold">{u.status}</td>
                  <td className="py-3 px-2 text-slate-900 font-mono font-bold">{u.meetingsCount}</td>
                  <td className="py-3 px-2 text-right">
                    <button className="text-slate-400 hover:text-slate-900">
                      <Settings className="w-4 h-4 ml-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
