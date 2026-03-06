import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, UserRound, ArrowRight, Video } from 'lucide-react'

const allDoctors = [
    { id: 1, name: 'Dr. Ravi Kumar', spec: 'Cardiologist', exp: '12 Years', rating: 4.9, patients: 340, avail: true, fee: '₹700', edu: 'MBBS, MD – AIIMS Delhi' },
    { id: 2, name: 'Dr. Priya Sharma', spec: 'Neurologist', exp: '8 Years', rating: 4.8, patients: 220, avail: true, fee: '₹600', edu: 'MBBS, DM – CMC Vellore' },
    { id: 3, name: 'Dr. Arjun Mehta', spec: 'Orthopedic', exp: '15 Years', rating: 4.9, patients: 190, avail: false, fee: '₹800', edu: 'MBBS, MS – Grant Medical Mumbai' },
    { id: 4, name: 'Dr. Sneha Patel', spec: 'Pediatrician', exp: '10 Years', rating: 4.7, patients: 150, avail: true, fee: '₹500', edu: 'MBBS, MD – JIPMER Pondicherry' },
    { id: 5, name: 'Dr. Karan Mehta', spec: 'Dermatologist', exp: '6 Years', rating: 4.6, patients: 98, avail: true, fee: '₹550', edu: 'MBBS, DVD – Osmania University' },
    { id: 6, name: 'Dr. Meera Iyer', spec: 'Gynecologist', exp: '11 Years', rating: 4.8, patients: 280, avail: false, fee: '₹650', edu: 'MBBS, MS – KMC Manipal' },
    { id: 7, name: 'Dr. Suresh Reddy', spec: 'Cardiologist', exp: '9 Years', rating: 4.7, patients: 165, avail: true, fee: '₹700', edu: 'MBBS, DM – Nizam\'s Institute' },
    { id: 8, name: 'Dr. Lakshmi Devi', spec: 'Ophthalmology', exp: '7 Years', rating: 4.6, patients: 120, avail: true, fee: '₹500', edu: 'MBBS, MS – SVIMS Tirupati' },
]

const specs = ['All', ...new Set(allDoctors.map(d => d.spec))]

export default function Doctors() {
    const [search, setSearch] = useState('')
    const [spec, setSpec] = useState('All')
    const [sortBy, setSortBy] = useState('rating')

    let filtered = allDoctors
        .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.spec.toLowerCase().includes(search.toLowerCase()))
        .filter(d => spec === 'All' || d.spec === spec)
        .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : parseInt(b.exp) - parseInt(a.exp))

    return (
        <div className="animate-fadeIn">
            {/* Hero */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-14 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Doctor</h1>
                    <p className="text-blue-200 mb-8">500+ specialist doctors, ready to help you</p>
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <Search size={20} className="text-gray-400 absolute left-4 top-3.5" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search doctor name or specialization..."
                                className="w-full pl-12 pr-4 py-3 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-10">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {specs.map(s => (
                            <button key={s} onClick={() => setSpec(s)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${spec === s ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 md:ml-auto">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select className="form-input py-2 w-auto text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="rating">Rating</option>
                            <option value="experience">Experience</option>
                        </select>
                    </div>
                </div>

                <p className="text-sm text-gray-500 mb-5">{filtered.length} doctors found</p>

                {/* Doctor Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filtered.map(d => (
                        <div key={d.id} className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 text-center">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 mx-auto shadow-sm">
                                    <UserRound size={32} />
                                </div>
                                <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${d.avail ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${d.avail ? 'bg-green-500' : 'bg-red-500'}`} />
                                    {d.avail ? 'Available Today' : 'Busy'}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 text-sm">{d.name}</h3>
                                <p className="text-blue-600 text-xs font-medium">{d.spec}</p>
                                <p className="text-gray-400 text-xs mt-0.5">{d.edu}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-1 text-sm">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-gray-800">{d.rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{d.exp}</span>
                                </div>
                                <div className="flex items-center justify-between mt-1 mb-3">
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><UserRound size={12} />{d.patients}</span>
                                    <span className="text-sm font-bold text-blue-600">{d.fee}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <Link to="/register" className="text-center py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-1">
                                        Book <ArrowRight size={12} />
                                    </Link>
                                    <Link to="/register" className="text-center py-2 text-blue-600 text-xs font-semibold rounded-xl border border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-1">
                                        <Video size={12} /> Online
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Search size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No doctors found matching your search.</p>
                    </div>
                )}
            </section>
        </div>
    )
}
