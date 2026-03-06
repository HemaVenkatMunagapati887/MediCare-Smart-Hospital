import React, { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, Users, Calendar, DollarSign, Download, FileText } from 'lucide-react'

const monthlyData = [
  { month: 'Jan', appointments: 45, revenue: 180000 },
  { month: 'Feb', appointments: 62, revenue: 248000 },
  { month: 'Mar', appointments: 78, revenue: 312000 },
  { month: 'Apr', appointments: 55, revenue: 220000 },
  { month: 'May', appointments: 90, revenue: 360000 },
  { month: 'Jun', appointments: 85, revenue: 340000 },
  { month: 'Jul', appointments: 102, revenue: 408000 },
  { month: 'Aug', appointments: 115, revenue: 460000 },
  { month: 'Sep', appointments: 98, revenue: 392000 },
  { month: 'Oct', appointments: 130, revenue: 520000 },
  { month: 'Nov', appointments: 142, revenue: 568000 },
  { month: 'Dec', appointments: 138, revenue: 552000 },
]

const deptPie = [
  { name: 'Cardiology', value: 340, color: '#EF4444' },
  { name: 'Neurology', value: 220, color: '#8B5CF6' },
  { name: 'Orthopedic', value: 190, color: '#F97316' },
  { name: 'Pediatrics', value: 150, color: '#EC4899' },
  { name: 'Dermatology', value: 98, color: '#14B8A6' },
  { name: 'General', value: 348, color: '#3B82F6' },
]

const doctorWorkload = [
  { name: 'Dr. Ravi Kumar', patients: 340, appointments: 280 },
  { name: 'Dr. Priya Sharma', patients: 220, appointments: 195 },
  { name: 'Dr. Arjun Mehta', patients: 190, appointments: 170 },
  { name: 'Dr. Sneha Patel', patients: 150, appointments: 130 },
  { name: 'Dr. Karan Mehta', patients: 98, appointments: 85 },
]

const TABS = ['Monthly Trends', 'Department Visits', 'Doctor Workload']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Reports() {
  const [tab, setTab] = useState('Monthly Trends')

  const totalAppointments = monthlyData.reduce((a, b) => a + b.appointments, 0)
  const totalRevenue = monthlyData.reduce((a, b) => a + b.revenue, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Analytics Dashboard</h1>
          <p className="section-subtitle">Hospital performance metrics — FY 2025–26</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Download size={15} /> Export CSV
          </button>
          <button className="btn-secondary flex items-center gap-2 text-sm py-2">
            <FileText size={15} /> PDF Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Appointments', value: totalAppointments, icon: Calendar, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', trend: '+18%' },
          { label: 'Total Patients', value: '1,248', icon: Users, color: 'bg-teal-50 text-teal-600', border: 'border-teal-100', trend: '+12%' },
          { label: 'Revenue (Annual)', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, color: 'bg-green-50 text-green-600', border: 'border-green-100', trend: '+15%' },
          { label: 'Avg Per Month', value: Math.round(totalAppointments / 12), icon: TrendingUp, color: 'bg-violet-50 text-violet-600', border: 'border-violet-100', trend: '+8%' },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-5 hover:shadow-md transition-shadow`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp size={11} /> {s.trend} from last year
            </p>
          </div>
        ))}
      </div>

      {/* Chart Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t ? 'bg-white text-violet-600 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Monthly Trends — Line Chart */}
      {tab === 'Monthly Trends' && (
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-1">Monthly Appointments — 2025/26</h2>
          <p className="text-sm text-gray-400 mb-6">Total appointments per month across all departments</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <Line type="monotone" dataKey="appointments" name="Appointments" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: '#2563EB', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Department Visits — Pie Chart */}
      {tab === 'Department Visits' && (
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-1">Department-wise Patient Distribution</h2>
          <p className="text-sm text-gray-400 mb-6">Total patients treated per department — 2025/26</p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={deptPie} cx="50%" cy="50%" innerRadius={70} outerRadius={120}
                  paddingAngle={4} dataKey="value" nameKey="name">
                  {deptPie.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value + ' patients', name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {deptPie.map(d => (
                <div key={d.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="font-medium text-gray-700">{d.name}</span>
                    </div>
                    <span className="text-gray-500">{d.value} patients</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(d.value / 1346) * 100}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Doctor Workload — Bar Chart */}
      {tab === 'Doctor Workload' && (
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-1">Doctor Workload Analysis</h2>
          <p className="text-sm text-gray-400 mb-6">Patients served and appointments completed per doctor</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={doctorWorkload} margin={{ top: 5, right: 20, left: 0, bottom: 60 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <Bar dataKey="patients" name="Total Patients" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              <Bar dataKey="appointments" name="Appointments Completed" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Performers Table */}
      <div className="card overflow-hidden p-0">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Top Performing Doctors</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Rank</th>
                <th className="table-th">Doctor</th>
                <th className="table-th">Specialization</th>
                <th className="table-th">Patients</th>
                <th className="table-th">Appointments</th>
              </tr>
            </thead>
            <tbody>
              {doctorWorkload.map((d, i) => (
                <tr key={d.name} className="hover:bg-gray-50">
                  <td className="table-td">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-500' : 'bg-blue-100 text-blue-600'}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="table-td font-semibold text-gray-900">{d.name}</td>
                  <td className="table-td text-blue-600">
                    {['Cardiologist', 'Neurologist', 'Orthopedic', 'Pediatrician', 'Dermatologist'][i]}
                  </td>
                  <td className="table-td font-bold">{d.patients}</td>
                  <td className="table-td font-bold">{d.appointments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
