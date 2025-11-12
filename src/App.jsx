import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur border border-white/10">
      {children}
    </span>
  )
}

function Amenity({ label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 px-3 py-1 text-xs text-zinc-200 border border-white/10">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {label}
    </span>
  )
}

function PropertyCard({ item }) {
  const cover = item?.images?.[0] || `https://images.unsplash.com/photo-1499696010189-9d2150aee9f6`
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur transition hover:translate-y-[-2px] hover:shadow-2xl">
      <div className="aspect-[16/11] w-full overflow-hidden">
        <img src={cover + '?auto=format&fit=crop&w=1200&q=60'} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold truncate pr-2">{item.title}</h3>
          <Badge>${'{'}item.price_per_night{'}'}/night</Badge>
        </div>
        <p className="mt-1 text-zinc-400 text-sm line-clamp-2">{item.location}, {item.country}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(item.amenities || []).slice(0, 3).map((a, i) => (
            <Amenity key={i} label={a} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  const fetchFeatured = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/properties/featured`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const search = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (type) params.set('type', type)
      const res = await fetch(`${API_BASE}/api/properties?${params.toString()}`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatured()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative h-[68vh] w-full">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/1VHYoewWfi45VYZ5/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black pt-20 pointer-events-none" />
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-6 pb-10">
            <div className="max-w-3xl">
              <div className="flex gap-2 mb-4">
                <Badge>Luxury</Badge>
                <Badge>Villas</Badge>
                <Badge>Farmhouses</Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Stay in extraordinary villas & farmhouses</h1>
              <p className="mt-3 text-zinc-300 max-w-2xl">Curated stays with private pools, serene views, and contemporary design. Discover unique escapes tailored for groups, families, and weekend getaways.</p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6">
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search city, country or listing" className="w-full rounded-xl bg-zinc-900/70 border border-white/10 px-4 py-3 outline-none focus:ring-2 ring-white/20" />
                </div>
                <div className="md:col-span-3">
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full rounded-xl bg-zinc-900/70 border border-white/10 px-4 py-3 outline-none focus:ring-2 ring-white/20">
                    <option value="">All types</option>
                    <option value="villa">Villa</option>
                    <option value="farmhouse">Farmhouse</option>
                    <option value="cottage">Cottage</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <button onClick={search} className="w-full rounded-xl bg-white/90 text-black font-medium px-4 py-3 hover:bg-white transition">Search</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listing grid */}
      <section className="container mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">Featured stays</h2>
          <button onClick={fetchFeatured} className="text-sm text-zinc-300 hover:text-white">Refresh</button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-60 rounded-2xl bg-zinc-900/60 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it) => (
              <PropertyCard key={it._id} item={it} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-zinc-400">
        Built for modern getaways • Dark theme • Minimal & elegant
      </footer>
    </div>
  )
}
