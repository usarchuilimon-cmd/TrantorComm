import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MessageSquare, CreditCard, Activity, Search, Shield, LogOut } from 'lucide-react';
import { useOrganizations } from '../hooks/useOrganizations';
import { Organization } from '../types';

interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
                <Icon className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">
                {change}
            </span>
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
);

const SuperAdminDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { organizations, loading, toggleStatus } = useOrganizations();

    // Mock data for the chart (Revenue not yet in DB schema)
    const revenueData = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
        { name: 'Jul', value: 3490 },
    ];

    const filteredOrgs = organizations.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Cargando organizaciones...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-slate-50 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-indigo-600" />
                        Super Admin Backoffice
                    </h1>
                    <p className="text-slate-500 mt-1">Global System Overview & Tenant Management</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                        + Nueva Organización
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard title="Total Tenants" value={organizations.length.toString()} change="+3 this month" icon={Users} />
                <MetricCard title="Active Messages" value="1.2M" change="+12.5%" icon={MessageSquare} />
                <MetricCard title="MRR (Revenue)" value="$45,200" change="+8.2%" icon={CreditCard} />
                <MetricCard title="System Health" value="99.99%" change="Stable" icon={Activity} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tenants List */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg text-slate-800">Organizaciones (Tenants)</h2>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tenant..."
                                className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 w-64 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Organization Name</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrgs.map((org) => (
                                <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {org.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-slate-700">{org.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${org.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                                                org.plan === 'PRO' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}
                    `}>
                                            {org.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(org.id, org.status)}
                                            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full cursor-pointer hover:opacity-80
                                            ${org.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                          `}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${org.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {org.status.toUpperCase()}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {new Date(org.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center justify-end gap-1 w-full group">
                                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            Login As
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
                    <h2 className="font-bold text-lg text-slate-800 mb-6">Revenue Overview</h2>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
