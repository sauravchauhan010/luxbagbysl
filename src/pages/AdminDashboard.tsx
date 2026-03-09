import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, LogOut, Trash2, Edit } from 'lucide-react';
import { Product } from '../types';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'add'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
    fetchProducts();
  }, [token]);

  const fetchStats = async () => {
    const res = await fetch('/api/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    } else if (res.status === 401) {
      navigate('/admin/login');
    }
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/products?admin=true');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts();
        fetchStats();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-luxury-black text-white p-6 space-y-8">
        <div className="flex flex-col">
          <span className="text-xl font-display tracking-tighter font-bold">LUX BAG</span>
          <span className="text-[8px] uppercase tracking-[0.3em] text-gold">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => { setActiveTab('stats'); setEditingProduct(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest transition-colors ${activeTab === 'stats' ? 'bg-gold text-luxury-black' : 'hover:bg-gray-800'}`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest transition-colors ${activeTab === 'products' ? 'bg-gold text-luxury-black' : 'hover:bg-gray-800'}`}
          >
            <Package size={16} />
            <span>Products</span>
          </button>
          <button
            onClick={() => { setActiveTab('add'); setEditingProduct(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest transition-colors ${activeTab === 'add' ? 'bg-gold text-luxury-black' : 'hover:bg-gray-800'}`}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </nav>

        <div className="pt-12">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'stats' && stats && (
          <div className="space-y-8">
            <h2 className="text-3xl font-display">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 shadow-sm border border-gray-100">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Total Products</p>
                <p className="text-4xl font-display text-gold">{stats.totalProducts}</p>
              </div>
            </div>

            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <h3 className="text-xs uppercase tracking-widest font-bold mb-6">Recently Added</h3>
              <div className="space-y-4">
                {stats.recentProducts.map((p: Product) => (
                  <div key={p.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={p.images[0]} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{p.product_name}</p>
                        <p className="text-xs text-gray-400">AED {p.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest bg-gray-100 px-2 py-1">{p.condition}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-display">Manage Products</h2>
              <button onClick={() => setActiveTab('add')} className="btn-luxury py-2">Add New</button>
            </div>
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold w-12 text-center">#</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Product</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">ID</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Price</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Curated</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Status</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p, index) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-400 text-center">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={p.images[0]} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-sm font-medium">{p.product_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{p.product_id}</td>
                      <td className="px-6 py-4 text-sm">AED {p.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {p.is_curated === 1 && (
                          <span className="text-[10px] uppercase tracking-widest px-2 py-1 font-bold bg-gold-light text-gold">
                            Curated
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 font-bold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => { setEditingProduct(p); setActiveTab('add'); }}
                            className="text-gray-400 hover:text-gold transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeTab === 'add' || editingProduct) && (
          <ProductForm 
            token={token!} 
            onSuccess={() => { 
              setActiveTab('products'); 
              setEditingProduct(null);
              fetchProducts(); 
              fetchStats(); 
            }} 
            initialData={editingProduct}
          />
        )}
      </div>
    </div>
  );
};

const ProductForm = ({ token, onSuccess, initialData }: { token: string, onSuccess: () => void, initialData: Product | null }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [isActive, setIsActive] = useState<boolean>(initialData ? !!initialData.is_active : true);
  const [isCurated, setIsCurated] = useState<boolean>(initialData ? !!initialData.is_curated : false);
  const [category, setCategory] = useState<'Bags' | 'Footwear'>(initialData?.category || 'Bags');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    formData.append('existing_images', JSON.stringify(existingImages));
    formData.append('is_active', isActive ? '1' : '0');
    formData.append('is_curated', isCurated ? '1' : '0');

    const url = initialData ? `/api/products/${initialData.id}` : '/api/products';
    const method = initialData ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      onSuccess();
    } else {
      alert(data.message || 'Failed to save product');
    }
    setLoading(false);
  };

  const setMainImage = (index: number) => {
    const newImages = [...existingImages];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    setExistingImages(newImages);
  };

  const removeImage = (index: number) => {
    if (window.confirm('Remove this image?')) {
      const newImages = [...existingImages];
      newImages.splice(index, 1);
      setExistingImages(newImages);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-10 shadow-sm border border-gray-100">
      <h2 className="text-3xl font-display mb-8">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Product Name</label>
            <input name="product_name" defaultValue={initialData?.product_name} required className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none transition-colors" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Product ID</label>
            <input name="product_id" defaultValue={initialData?.product_id} required className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Price (AED)</label>
            <input name="price" type="number" defaultValue={initialData?.price} required className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none transition-colors" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Condition</label>
            <select name="condition" defaultValue={initialData?.condition || 'New'} className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none transition-colors bg-transparent">
              <option value="New">New</option>
              <option value="Preloved">Preloved</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Category</label>
            <select 
              name="category" 
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none transition-colors bg-transparent"
            >
              <option value="Bags">Bags</option>
              <option value="Footwear">Footwear</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
              {category === 'Footwear' ? 'Sizes (comma separated, e.g. 37, 38, 39)' : 'Size / Dimensions'}
            </label>
            <input name="size" defaultValue={initialData?.size} placeholder={category === 'Footwear' ? 'e.g. 37, 38, 39' : 'e.g. 25cm'} className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Status</label>
            <div className="flex items-center space-x-4 py-2">
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${isActive ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-400 border-gray-200'}`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${!isActive ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-400 border-gray-200'}`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Curated Selection</label>
            <div className="flex items-center space-x-4 py-2">
              <button
                type="button"
                onClick={() => setIsCurated(!isCurated)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${isCurated ? 'bg-gold text-luxury-black border-gold' : 'bg-white text-gray-400 border-gray-200'}`}
              >
                {isCurated ? 'Featured' : 'Standard'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Description</label>
          <textarea name="description" defaultValue={initialData?.description} rows={4} className="w-full border border-gray-200 p-3 focus:border-gold outline-none transition-colors" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Images</label>
          <input 
            type="file" 
            multiple 
            onChange={(e) => setImages(e.target.files)}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-gold-light file:text-gold hover:file:bg-gold hover:file:text-white file:transition-all" 
          />
          {existingImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <div className="aspect-square bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={img} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-0 left-0 bg-gold text-white text-[8px] uppercase tracking-widest px-1 font-bold">Main</div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-1">
                    {idx !== 0 && (
                      <button 
                        type="button" 
                        onClick={() => setMainImage(idx)}
                        className="text-[8px] uppercase tracking-widest font-bold text-white bg-gold px-2 py-1 hover:bg-white hover:text-gold transition-all"
                      >
                        Set Main
                      </button>
                    )}
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="text-[8px] uppercase tracking-widest font-bold text-white bg-red-600 px-2 py-1 hover:bg-white hover:text-red-600 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 flex space-x-4">
          <button type="submit" disabled={loading} className="btn-luxury flex-1">
            {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Add Product')}
          </button>
          {initialData && (
            <button type="button" onClick={onSuccess} className="px-8 py-3 uppercase tracking-widest text-xs border border-gray-200 hover:bg-gray-50 transition-all">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
