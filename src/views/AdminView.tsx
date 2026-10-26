import React, { useState } from 'react';
import { Product, ProductCategory, SiteData, StoreScheduleConfig } from '../types';
import { updateAdminPassword } from '../data/cmsStore';
import { googleMapsEmbedUrl, googleMapsSearchUrl } from '../lib/maps';
import { ScheduleEditor } from '../components/ScheduleEditor';
import { formatScheduleSummary } from '../lib/schedule';

interface AdminViewProps {
  siteData: SiteData;
  onUpdateSiteData: (newData: SiteData) => void;
  onResetData: () => void;
  onExitAdmin: () => void;
  onLogout: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  siteData,
  onUpdateSiteData,
  onResetData,
  onExitAdmin,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'productos' | 'textos' | 'imagenes' | 'identidad' | 'respaldo'>('productos');
  const [subTab, setSubTab] = useState<'inicio' | 'catalogo' | 'visitanos'>('inicio');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  
  // Product editing modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productForm, setProductForm] = useState<Product | null>(null);

  // Security pass state
  const [newPassword, setNewPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    const newId = `producto-${Date.now()}`;
    const emptyProd: Product = {
      id: newId,
      name: 'Nueva Creación Artesanal',
      subtitle: 'Edición Especial',
      category: 'puras',
      categoryLabel: 'Barras Puras',
      badge: 'Cacao 70%',
      badgeColor: 'primary',
      price: 'S/ 20.00',
      priceValue: 20,
      shortDesc: 'Descripción breve de la nueva barra o bombón artesanal.',
      fullDesc: 'Notas sensoriales detalladas, método de elaboración y pureza de ingredientes seleccionados.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzfn5-EatkC0GTOTODeigjbf8UwZevZ8kHwK4PRlHBsvChOrH1ew8-_tXhWtimZ9lGOhqwSHq5ajFwkKnu8mO3Fen_zdzz2qHgUOwzZ35h30pkl0gn82gpgLzXVMjj5WtT6PAGCk0HSigpuSGurUz8WUcQUsrovAsgaDXYVzAde1sfYh7lKoyZW00tzyBvfEXotle6m9M9yYd_v_kzM5OTzi3mYD_qaTFebAZPyCXlohpndZPPW0YB',
      ingredients: 'Pasta de cacao nativo, manteca de cacao pura y panela orgánica.',
      netWeight: '80 gramos',
      aromaProfile: 'Notas cálidas a cacao tostado y frutos secos',
      conservation: '16°C – 19°C · Lugar fresco y seco',
      origin: 'Cacao Peruano Seleccionado',
      intensity: 4.0,
      intensityDesc: 'Cuerpo equilibrado de tostado pausado.',
      fruitNotes: 3.5,
      fruitNotesDesc: 'Matices frutales delicados.',
      persistence: 4.2,
      persistenceDesc: 'Sensación prolongada en boca.',
    };
    setProductForm(emptyProd);
    setIsNewProduct(true);
    setEditingProduct(emptyProd);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setProductForm({ ...prod });
    setIsNewProduct(false);
    setEditingProduct(prod);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm) return;

    let updatedProducts: Product[];
    if (isNewProduct) {
      updatedProducts = [productForm, ...siteData.products];
    } else {
      updatedProducts = siteData.products.map((p) => (p.id === productForm.id ? productForm : p));
    }

    onUpdateSiteData({
      ...siteData,
      products: updatedProducts,
    });

    setEditingProduct(null);
    setProductForm(null);
    showToast(isNewProduct ? '✓ Producto creado exitosamente' : '✓ Producto actualizado correctamente');
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`¿Está seguro de eliminar "${name}" del catálogo?`)) {
      const updatedProducts = siteData.products.filter((p) => p.id !== id);
      onUpdateSiteData({
        ...siteData,
        products: updatedProducts,
      });
      showToast(`✓ Producto "${name}" eliminado`);
    }
  };

  const handleDuplicateProduct = (prod: Product) => {
    const dup: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      name: `${prod.name} (Copia)`,
    };
    onUpdateSiteData({
      ...siteData,
      products: [dup, ...siteData.products],
    });
    showToast(`✓ Producto duplicado: "${dup.name}"`);
  };

  // Section texts update
  const handleUpdateHomeText = (field: keyof typeof siteData.home, value: any) => {
    onUpdateSiteData({
      ...siteData,
      home: {
        ...siteData.home,
        [field]: value,
      },
    });
  };

  const handleUpdateCatalogText = (field: keyof typeof siteData.catalog, value: string) => {
    onUpdateSiteData({
      ...siteData,
      catalog: {
        ...siteData.catalog,
        [field]: value,
      },
    });
  };

  const handleUpdateSchedule = (updatedSchedule: StoreScheduleConfig) => {
    onUpdateSiteData({
      ...siteData,
      schedule: updatedSchedule,
      visit: {
        ...siteData.visit,
        schedulePlaceholder: formatScheduleSummary(updatedSchedule),
      },
    });
  };

  const handleUpdateVisitText = (field: keyof typeof siteData.visit, value: string) => {
    onUpdateSiteData({
      ...siteData,
      visit: {
        ...siteData.visit,
        [field]: value,
      },
    });
  };

  // Brand updates
  const handleUpdateBrand = (field: keyof typeof siteData.brand, value: string) => {
    onUpdateSiteData({
      ...siteData,
      brand: {
        ...siteData.brand,
        [field]: value,
      },
    });
  };

  // Export JSON
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fernandina_chocolates_respaldo_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Respaldo exportado exitosamente');
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.brand && parsed.products) {
          onUpdateSiteData(parsed);
          showToast('✓ Respaldo importado y aplicado correctamente');
        } else {
          alert('El archivo no parece ser un respaldo válido de Fernandina de Jagua.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Change password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 4) {
      setPasswordFeedback('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    updateAdminPassword(newPassword);
    setNewPassword('');
    setPasswordFeedback('✓ Contraseña administrativa actualizada.');
    setTimeout(() => setPasswordFeedback(''), 3000);
  };

  // Filtered products list
  const filteredProducts = siteData.products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.price.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#1c1411] text-surface font-body-md flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-[#241713] border-b border-[#3d2720] px-4 sm:px-8 py-3.5 sticky top-0 z-40 shadow-lg">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-on-secondary font-bold text-sm shadow-md">
              CMS
            </div>
            <div>
              <h1 className="font-headline-sm text-lg text-surface-bright leading-tight flex items-center gap-2">
                <span>{siteData.brand.name}</span>
                <span className="text-[10px] font-label-sm uppercase px-2 py-0.5 rounded bg-secondary/20 text-secondary-fixed border border-secondary/30">
                  Panel de Control
                </span>
              </h1>
              <span className="font-label-sm text-[10px] text-primary-fixed-dim uppercase tracking-wider block">
                Gestión Integral de Textos, Imágenes &amp; Catálogo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container-high/20 hover:bg-surface-container-high/40 text-surface-bright text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer border border-[#482e25]"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Ver Sitio Web</span>
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-200 text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer border border-red-800/40"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="bg-[#2a1b16] border-b border-[#3d2720] px-4 sm:px-8">
        <div className="max-w-[1400px] mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('productos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'productos'
                ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                : 'text-primary-fixed-dim hover:text-surface-bright hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>Productos ({siteData.products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('textos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'textos'
                ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                : 'text-primary-fixed-dim hover:text-surface-bright hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>Textos de Páginas</span>
          </button>

          <button
            onClick={() => setActiveTab('imagenes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'imagenes'
                ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                : 'text-primary-fixed-dim hover:text-surface-bright hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">photo_library</span>
            <span>Imágenes &amp; Multimedia</span>
          </button>

          <button
            onClick={() => setActiveTab('identidad')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'identidad'
                ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                : 'text-primary-fixed-dim hover:text-surface-bright hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Identidad &amp; Contacto</span>
          </button>

          <button
            onClick={() => setActiveTab('respaldo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'respaldo'
                ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                : 'text-primary-fixed-dim hover:text-surface-bright hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">backup</span>
            <span>Respaldos &amp; Seguridad</span>
          </button>
        </div>
      </div>

      {/* Main CMS Container */}
      <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-6 flex-1">
        {/* TAB 1: PRODUCTOS */}
        {activeTab === 'productos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#261814] p-4 rounded-xl border border-[#3e2821]">
              <div className="flex flex-1 items-center gap-3 max-w-xl">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary-fixed-dim text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar producto por nombre, precio o perfil..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#1a100d] border border-[#3e2821] text-surface text-sm focus:outline-none focus:border-secondary"
                  />
                </div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="py-2 px-3 rounded-lg bg-[#1a100d] border border-[#3e2821] text-surface text-sm focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="puras">Barras Puras</option>
                  <option value="bombones">Bombones &amp; Trufas</option>
                  <option value="frutas">Cacao &amp; Frutas</option>
                  <option value="especialidades">Especialidades</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-on-secondary hover:bg-on-tertiary-container font-label-md text-label-md uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Agregar Nuevo Producto</span>
              </button>
            </div>

            {/* Products Table/Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#241713] rounded-xl border border-[#3e2821] overflow-hidden flex flex-col justify-between hover:border-secondary/40 transition-colors shadow-sm"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#180f0c]">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-surface-bright font-label-sm text-[10px] uppercase tracking-wider">
                        {prod.badge}
                      </div>
                      <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded bg-secondary text-on-secondary font-bold text-xs shadow">
                        {prod.price}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="font-label-sm text-[10px] text-secondary-fixed uppercase tracking-widest block">
                        {prod.categoryLabel} · {prod.subtitle}
                      </span>
                      <h3 className="font-headline-sm text-base text-surface-bright leading-snug">
                        {prod.name}
                      </h3>
                      <p className="font-body-sm text-xs text-primary-fixed-dim line-clamp-2">
                        {prod.shortDesc}
                      </p>

                      <div className="pt-2 flex items-center gap-3 text-[11px] text-primary-fixed-dim/80">
                        <span>Peso: <strong className="text-surface">{prod.netWeight}</strong></span>
                        <span>·</span>
                        <span>Intensidad: <strong className="text-surface">{prod.intensity}/5</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#1c120e] border-t border-[#36211a] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#2e1d17] hover:bg-secondary hover:text-on-secondary text-surface text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDuplicateProduct(prod)}
                      title="Duplicar producto"
                      className="p-1.5 rounded bg-[#2e1d17] hover:bg-[#3d2720] text-primary-fixed-dim hover:text-surface text-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      title="Eliminar producto"
                      className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 bg-[#241713] rounded-xl border border-[#3e2821]">
                <span className="material-symbols-outlined text-4xl text-primary-fixed-dim mb-2">
                  inventory_2
                </span>
                <p className="text-surface-bright font-medium">No se encontraron productos</p>
                <p className="text-xs text-primary-fixed-dim mt-1">
                  Intente con otro término de búsqueda o categoría.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TEXTOS DE PÁGINAS */}
        {activeTab === 'textos' && (
          <div className="space-y-6">
            {/* Sub-navigation */}
            <div className="flex items-center gap-2 border-b border-[#3d2720] pb-2">
              <button
                onClick={() => setSubTab('inicio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer ${
                  subTab === 'inicio' ? 'bg-secondary text-on-secondary font-semibold' : 'text-primary-fixed-dim hover:text-surface'
                }`}
              >
                Página de Inicio
              </button>
              <button
                onClick={() => setSubTab('catalogo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer ${
                  subTab === 'catalogo' ? 'bg-secondary text-on-secondary font-semibold' : 'text-primary-fixed-dim hover:text-surface'
                }`}
              >
                Página de Productos
              </button>
              <button
                onClick={() => setSubTab('visitanos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer ${
                  subTab === 'visitanos' ? 'bg-secondary text-on-secondary font-semibold' : 'text-primary-fixed-dim hover:text-surface'
                }`}
              >
                Página Visítanos
              </button>
            </div>

            {/* Sub-tab 1: Inicio */}
            {subTab === 'inicio' && (
              <div className="space-y-6 bg-[#241713] p-6 rounded-xl border border-[#3e2821]">
                <h3 className="font-headline-sm text-base text-secondary-fixed border-b border-[#3a251e] pb-2">
                  1. Portada / Hero
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Kicker Superior
                    </label>
                    <input
                      type="text"
                      value={siteData.home.heroOverline}
                      onChange={(e) => handleUpdateHomeText('heroOverline', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Subtítulo Cursiva
                    </label>
                    <input
                      type="text"
                      value={siteData.home.heroSubtitle}
                      onChange={(e) => handleUpdateHomeText('heroSubtitle', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Párrafo Descriptivo
                    </label>
                    <textarea
                      rows={2}
                      value={siteData.home.heroDesc}
                      onChange={(e) => handleUpdateHomeText('heroDesc', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Distintivo 1
                    </label>
                    <input
                      type="text"
                      value={siteData.home.heroBadge1}
                      onChange={(e) => handleUpdateHomeText('heroBadge1', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Distintivo 2
                    </label>
                    <input
                      type="text"
                      value={siteData.home.heroBadge2}
                      onChange={(e) => handleUpdateHomeText('heroBadge2', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>

                <h3 className="font-headline-sm text-base text-secondary-fixed border-b border-[#3a251e] pb-2 pt-4">
                  2. Colección Principal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Kicker
                    </label>
                    <input
                      type="text"
                      value={siteData.home.collectionOverline}
                      onChange={(e) => handleUpdateHomeText('collectionOverline', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Título de Sección
                    </label>
                    <input
                      type="text"
                      value={siteData.home.collectionTitle}
                      onChange={(e) => handleUpdateHomeText('collectionTitle', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Descripción de Creaciones
                    </label>
                    <textarea
                      rows={2}
                      value={siteData.home.collectionDesc}
                      onChange={(e) => handleUpdateHomeText('collectionDesc', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>

                <h3 className="font-headline-sm text-base text-secondary-fixed border-b border-[#3a251e] pb-2 pt-4">
                  3. Alternativas al checkout web
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Título Alternativa 1 (App Móvil)
                    </label>
                    <input
                      type="text"
                      value={siteData.home.option1Title}
                      onChange={(e) => handleUpdateHomeText('option1Title', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Título Alternativa 2 (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={siteData.home.option2Title}
                      onChange={(e) => handleUpdateHomeText('option2Title', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Descripción Alternativa 1
                    </label>
                    <textarea
                      rows={2}
                      value={siteData.home.option1Desc}
                      onChange={(e) => handleUpdateHomeText('option1Desc', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Descripción Alternativa 2
                    </label>
                    <textarea
                      rows={2}
                      value={siteData.home.option2Desc}
                      onChange={(e) => handleUpdateHomeText('option2Desc', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Catálogo */}
            {subTab === 'catalogo' && (
              <div className="space-y-6 bg-[#241713] p-6 rounded-xl border border-[#3e2821]">
                <h3 className="font-headline-sm text-base text-secondary-fixed border-b border-[#3a251e] pb-2">
                  Cabecera del Catálogo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Kicker
                    </label>
                    <input
                      type="text"
                      value={siteData.catalog.catalogOverline}
                      onChange={(e) => handleUpdateCatalogText('catalogOverline', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={siteData.catalog.catalogTitle}
                      onChange={(e) => handleUpdateCatalogText('catalogTitle', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Aviso Destacado de Pedido (Cuadro informativo)
                    </label>
                    <textarea
                      rows={2}
                      value={siteData.catalog.catalogNotice}
                      onChange={(e) => handleUpdateCatalogText('catalogNotice', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>

                <h3 className="font-headline-sm text-base text-secondary-fixed border-b border-[#3a251e] pb-2 pt-4">
                  Banner Inferior de Asistencia
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Título del Banner
                    </label>
                    <input
                      type="text"
                      value={siteData.catalog.orderBannerTitle}
                      onChange={(e) => handleUpdateCatalogText('orderBannerTitle', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Texto del Banner
                    </label>
                    <textarea
                      rows={2}
                      value={siteData.catalog.orderBannerDesc}
                      onChange={(e) => handleUpdateCatalogText('orderBannerDesc', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Visítanos */}
            {subTab === 'visitanos' && (
              <div className="space-y-6 bg-[#241713] p-6 rounded-xl border border-[#3e2821]">
                <h3 className="font-headline-sm text-base text-secondary-fixed border-b border-[#3a251e] pb-2">
                  Cabecera &amp; Horarios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Etiqueta Superior
                    </label>
                    <input
                      type="text"
                      value={siteData.visit.headerTag}
                      onChange={(e) => handleUpdateVisitText('headerTag', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Título
                    </label>
                    <input
                      type="text"
                      value={siteData.visit.headerTitle}
                      onChange={(e) => handleUpdateVisitText('headerTitle', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                      Descripción del Atelier
                    </label>
                    <textarea
                      rows={2}
                      value={siteData.visit.headerDesc}
                      onChange={(e) => handleUpdateVisitText('headerDesc', e.target.value)}
                      className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>

                <ScheduleEditor
                  schedule={siteData.schedule}
                  onChange={handleUpdateSchedule}
                />

                <h3 className="font-headline-sm text-base text-secondary-fixed border-b border-[#3a251e] pb-2 pt-4">
                  Guías de Accesibilidad &amp; Llegada
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {/* Guia 1 */}
                  <div className="p-3 bg-[#1c120e] rounded-lg border border-[#38221b] space-y-2">
                    <span className="font-bold text-xs text-secondary">Guía 1: Eje Costero</span>
                    <input
                      type="text"
                      value={siteData.visit.ref1Subtitle}
                      onChange={(e) => handleUpdateVisitText('ref1Subtitle', e.target.value)}
                      className="w-full p-2 text-xs rounded bg-[#150d0a] border border-[#38221b] text-surface"
                      placeholder="Subtítulo"
                    />
                    <textarea
                      rows={3}
                      value={siteData.visit.ref1Desc}
                      onChange={(e) => handleUpdateVisitText('ref1Desc', e.target.value)}
                      className="w-full p-2 text-xs rounded bg-[#150d0a] border border-[#38221b] text-surface"
                      placeholder="Instrucciones"
                    />
                  </div>

                  {/* Guia 2 */}
                  <div className="p-3 bg-[#1c120e] rounded-lg border border-[#38221b] space-y-2">
                    <span className="font-bold text-xs text-secondary">Guía 2: Avenidas Principales</span>
                    <input
                      type="text"
                      value={siteData.visit.ref2Subtitle}
                      onChange={(e) => handleUpdateVisitText('ref2Subtitle', e.target.value)}
                      className="w-full p-2 text-xs rounded bg-[#150d0a] border border-[#38221b] text-surface"
                      placeholder="Subtítulo"
                    />
                    <textarea
                      rows={3}
                      value={siteData.visit.ref2Desc}
                      onChange={(e) => handleUpdateVisitText('ref2Desc', e.target.value)}
                      className="w-full p-2 text-xs rounded bg-[#150d0a] border border-[#38221b] text-surface"
                      placeholder="Instrucciones"
                    />
                  </div>

                  {/* Guia 3 */}
                  <div className="p-3 bg-[#1c120e] rounded-lg border border-[#38221b] space-y-2">
                    <span className="font-bold text-xs text-secondary">Guía 3: Fachada &amp; Recepción</span>
                    <input
                      type="text"
                      value={siteData.visit.ref3Subtitle}
                      onChange={(e) => handleUpdateVisitText('ref3Subtitle', e.target.value)}
                      className="w-full p-2 text-xs rounded bg-[#150d0a] border border-[#38221b] text-surface"
                      placeholder="Subtítulo"
                    />
                    <textarea
                      rows={3}
                      value={siteData.visit.ref3Desc}
                      onChange={(e) => handleUpdateVisitText('ref3Desc', e.target.value)}
                      className="w-full p-2 text-xs rounded bg-[#150d0a] border border-[#38221b] text-surface"
                      placeholder="Instrucciones"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: IMÁGENES & MULTIMEDIA */}
        {activeTab === 'imagenes' && (
          <div className="space-y-6 bg-[#241713] p-6 rounded-xl border border-[#3e2821]">
            <div>
              <h3 className="font-headline-sm text-lg text-surface-bright">
                Gestión de Imágenes Principales del Sitio
              </h3>
              <p className="text-xs text-primary-fixed-dim mt-1">
                Puede reemplazar cualquier URL de imagen del sitio web y ver una previsualización en tiempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo */}
              <div className="bg-[#1c120e] p-4 rounded-xl border border-[#38221b] space-y-3">
                <span className="text-xs font-label-md uppercase text-secondary font-semibold block">
                  Logotipo Oficial de Marca
                </span>
                <div className="h-28 bg-[#2d1c16] rounded flex items-center justify-center p-2">
                  <img src={siteData.brand.logoUrl} alt="Logo" className="max-h-full object-contain" />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-primary-fixed-dim block mb-1">
                    URL de la Imagen del Logo
                  </label>
                  <input
                    type="text"
                    value={siteData.brand.logoUrl}
                    onChange={(e) => handleUpdateBrand('logoUrl', e.target.value)}
                    className="w-full p-2 text-xs rounded bg-[#150d0a] border border-[#38221b] text-surface focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              {/* Hero Image */}
              <div className="bg-[#1c120e] p-4 rounded-xl border border-[#38221b] space-y-3">
                <span className="text-xs font-label-md uppercase text-secondary font-semibold block">
                  Imagen de Portada (Hero Banner)
                </span>
                <div className="h-28 bg-[#2d1c16] rounded overflow-hidden">
                  <img src={siteData.brand.heroBgUrl} alt="Hero" className="w-full h-full object-cover" />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-primary-fixed-dim block mb-1">
                    URL de la Imagen de Portada
                  </label>
                  <input
                    type="text"
                    value={siteData.brand.heroBgUrl}
                    onChange={(e) => handleUpdateBrand('heroBgUrl', e.target.value)}
                    className="w-full p-2 text-xs rounded bg-[#150d0a] border border-[#38221b] text-surface focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              {/* Address-based Google Maps preview */}
              <div className="bg-[#1c120e] p-4 rounded-xl border border-[#38221b] space-y-3">
                <span className="text-xs font-label-md uppercase text-secondary font-semibold block">
                  Mapa de la Dirección Configurada
                </span>
                <div className="h-28 bg-[#2d1c16] rounded overflow-hidden">
                  <iframe
                    title={`Mapa de ${siteData.brand.address}, ${siteData.brand.district}`}
                    src={googleMapsEmbedUrl(siteData.brand.address, siteData.brand.district)}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <p className="text-xs text-primary-fixed-dim">
                  El mapa y el enlace se calculan automáticamente desde la dirección y el distrito configurados.
                </p>
              </div>

              {/* Ambient Background */}
              <div className="bg-[#1c120e] p-4 rounded-xl border border-[#38221b] space-y-3">
                <span className="text-xs font-label-md uppercase text-secondary font-semibold block">
                  Imagen Ambiental de Fondo (Visítanos CTA)
                </span>
                <div className="h-28 bg-[#2d1c16] rounded overflow-hidden">
                  <img src={siteData.brand.ambientImageUrl} alt="Ambient" className="w-full h-full object-cover" />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-primary-fixed-dim block mb-1">
                    URL de la Imagen Ambiental
                  </label>
                  <input
                    type="text"
                    value={siteData.brand.ambientImageUrl}
                    onChange={(e) => handleUpdateBrand('ambientImageUrl', e.target.value)}
                    className="w-full p-2 text-xs rounded bg-[#150d0a] border border-[#38221b] text-surface focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IDENTIDAD & CONTACTO */}
        {activeTab === 'identidad' && (
          <div className="space-y-6 bg-[#241713] p-6 rounded-xl border border-[#3e2821]">
            <h3 className="font-headline-sm text-base text-secondary-fixed border-b border-[#3a251e] pb-2">
              Datos de Empresa &amp; Atelier
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  Nombre Comercial
                </label>
                <input
                  type="text"
                  value={siteData.brand.name}
                  onChange={(e) => handleUpdateBrand('name', e.target.value)}
                  className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  Subtítulo / Marca
                </label>
                <input
                  type="text"
                  value={siteData.brand.subName}
                  onChange={(e) => handleUpdateBrand('subName', e.target.value)}
                  className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  Razón Social
                </label>
                <input
                  type="text"
                  value={siteData.brand.companyName}
                  onChange={(e) => handleUpdateBrand('companyName', e.target.value)}
                  className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  Eslogan / Tagline
                </label>
                <input
                  type="text"
                  value={siteData.brand.tagline}
                  onChange={(e) => handleUpdateBrand('tagline', e.target.value)}
                  className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  Dirección Física
                </label>
                <input
                  type="text"
                  value={siteData.brand.address}
                  onChange={(e) => handleUpdateBrand('address', e.target.value)}
                  className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  Distrito y País
                </label>
                <input
                  type="text"
                  value={siteData.brand.district}
                  onChange={(e) => handleUpdateBrand('district', e.target.value)}
                  className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  Número de WhatsApp Oficial
                </label>
                <input
                  type="text"
                  value={siteData.brand.whatsappNumber}
                  onChange={(e) => handleUpdateBrand('whatsappNumber', e.target.value)}
                  className="w-full p-2.5 rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  Destino del mapa
                </label>
                <a
                  href={googleMapsSearchUrl(siteData.brand.address, siteData.brand.district)}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm text-secondary underline underline-offset-4"
                >
                  Abrir la dirección configurada en Google Maps
                </a>
                <p className="mt-1 text-xs text-primary-fixed-dim">
                  Para cambiar el destino, actualiza Dirección Física y Distrito y País.
                </p>
              </div>
            </div>

            <ScheduleEditor
              schedule={siteData.schedule}
              onChange={handleUpdateSchedule}
            />

            {/* Change Password Form */}
            <div className="pt-6 border-t border-[#3a251e]">
              <h4 className="font-headline-sm text-sm text-secondary-fixed mb-2">
                Seguridad de Acceso al CMS
              </h4>
              <p className="text-xs text-primary-fixed-dim mb-3">
                Cambie la contraseña de ingreso al panel de control (por defecto: <code>admin123</code>).
              </p>
              <form onSubmit={handleChangePassword} className="flex flex-wrap items-center gap-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña..."
                  className="p-2 text-sm rounded bg-[#1a100d] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-secondary text-on-secondary text-xs font-label-md uppercase tracking-wider hover:bg-on-tertiary-container cursor-pointer transition-colors"
                >
                  Guardar Contraseña
                </button>
                {passwordFeedback && (
                  <span className="text-xs text-emerald-400 font-medium">{passwordFeedback}</span>
                )}
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: RESPALDO & SEGURIDAD */}
        {activeTab === 'respaldo' && (
          <div className="space-y-6 bg-[#241713] p-6 rounded-xl border border-[#3e2821]">
            <div>
              <h3 className="font-headline-sm text-lg text-surface-bright">
                Copia de Seguridad y Migración de Datos
              </h3>
              <p className="text-xs text-primary-fixed-dim mt-1">
                Descargue un archivo JSON con todos los textos, imágenes y productos configurados para tener un respaldo seguro o restaurar en cualquier momento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Export Card */}
              <div className="bg-[#1c120e] p-5 rounded-xl border border-[#38221b] space-y-3">
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-[24px]">file_download</span>
                  <h4 className="font-headline-sm text-base text-surface-bright">
                    Exportar Copia de Seguridad
                  </h4>
                </div>
                <p className="text-xs text-primary-fixed-dim leading-relaxed">
                  Genera y descarga un archivo <code>.json</code> con la totalidad de la información actual de la chocolatería.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-secondary text-on-secondary hover:bg-on-tertiary-container font-label-md text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Descargar Archivo JSON</span>
                </button>
              </div>

              {/* Import Card */}
              <div className="bg-[#1c120e] p-5 rounded-xl border border-[#38221b] space-y-3">
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-[24px]">file_upload</span>
                  <h4 className="font-headline-sm text-base text-surface-bright">
                    Importar Copia de Seguridad
                  </h4>
                </div>
                <p className="text-xs text-primary-fixed-dim leading-relaxed">
                  Restaura los contenidos del sitio subiendo un archivo de respaldo previamente exportado.
                </p>
                <label className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#2e1d17] hover:bg-[#3d2720] text-surface font-label-md text-xs uppercase tracking-wider transition-colors cursor-pointer border border-[#482e25]">
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  <span>Seleccionar Archivo JSON</span>
                  <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                </label>
              </div>
            </div>

            {/* Reset Factory Defaults */}
            <div className="pt-6 border-t border-[#3a251e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-headline-sm text-sm text-red-300">
                  Restablecer a Valores Iniciales
                </h4>
                <p className="text-xs text-primary-fixed-dim mt-0.5">
                  Elimina las personalizaciones locales y vuelve a los 8 productos y textos originales de la chocolatería.
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('¿Está seguro de restablecer todos los contenidos del sitio a sus valores iniciales?')) {
                    onResetData();
                    showToast('✓ Contenidos restablecidos a valores originales');
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-label-md uppercase tracking-wider transition-colors cursor-pointer border border-red-800/40"
              >
                Restablecer Todo
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Product Form Modal (Add / Edit) */}
      {editingProduct && productForm && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingProduct(null);
          }}
        >
          <div className="bg-[#241713] border border-[#4a3027] max-w-2xl w-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="bg-[#1c120e] p-4 border-b border-[#38221b] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {isNewProduct ? 'add_circle' : 'edit_note'}
                </span>
                <h3 className="font-headline-sm text-base text-surface-bright">
                  {isNewProduct ? 'Agregar Nuevo Producto al Catálogo' : `Editar: ${productForm.name}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-surface hover:bg-white/20 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                    Subtítulo / Colección
                  </label>
                  <input
                    type="text"
                    value={productForm.subtitle}
                    onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                    Categoría *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const labelMap: Record<ProductCategory, string> = {
                        puras: 'Barras Puras',
                        bombones: 'Bombones & Trufas',
                        frutas: 'Cacao & Frutas',
                        especialidades: 'Especialidades',
                      };
                      setProductForm({
                        ...productForm,
                        category: cat,
                        categoryLabel: labelMap[cat],
                      });
                    }}
                    className="w-full p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none cursor-pointer"
                  >
                    <option value="puras">Barras Puras</option>
                    <option value="bombones">Bombones &amp; Trufas</option>
                    <option value="frutas">Cacao &amp; Frutas</option>
                    <option value="especialidades">Especialidades</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                    Distintivo / Badge *
                  </label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Ej: Cacao 70%, Selección, Aromático"
                    className="w-full p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                    Precio a Mostrar *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.price}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = parseFloat(val.replace(/[^\d.]/g, '')) || 0;
                      setProductForm({ ...productForm, price: val, priceValue: num });
                    }}
                    placeholder="S/ 18.00"
                    className="w-full p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                    Peso Neto
                  </label>
                  <input
                    type="text"
                    value={productForm.netWeight}
                    onChange={(e) => setProductForm({ ...productForm, netWeight: e.target.value })}
                    placeholder="80 gramos, 12 unidades..."
                    className="w-full p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Preview & URL */}
              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  URL de Imagen del Producto *
                </label>
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-lg bg-[#180f0c] overflow-hidden shrink-0 border border-[#3e2821]">
                    <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="flex-1 p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  Descripción Corta (Para tarjetas del catálogo) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={productForm.shortDesc}
                  onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}
                  className="w-full p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                  Descripción Sensorial Completa (Para ficha de detalle)
                </label>
                <textarea
                  rows={3}
                  value={productForm.fullDesc}
                  onChange={(e) => setProductForm({ ...productForm, fullDesc: e.target.value })}
                  className="w-full p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                    Ingredientes
                  </label>
                  <input
                    type="text"
                    value={productForm.ingredients}
                    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
                    Perfil Aromático
                  </label>
                  <input
                    type="text"
                    value={productForm.aromaProfile}
                    onChange={(e) => setProductForm({ ...productForm, aromaProfile: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#160d0a] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              {/* Sensory Sliders */}
              <div className="p-3 bg-[#1c120e] rounded-lg border border-[#38221b] space-y-3">
                <span className="text-xs font-bold text-secondary uppercase font-label-sm block">
                  Perfil de Cata Sensorial (Escala 1.0 a 5.0)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Intensidad:</span>
                      <strong className="text-secondary">{productForm.intensity}</strong>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={productForm.intensity}
                      onChange={(e) =>
                        setProductForm({ ...productForm, intensity: parseFloat(e.target.value) })
                      }
                      className="w-full accent-secondary cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Notas Frutales:</span>
                      <strong className="text-secondary">{productForm.fruitNotes}</strong>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={productForm.fruitNotes}
                      onChange={(e) =>
                        setProductForm({ ...productForm, fruitNotes: parseFloat(e.target.value) })
                      }
                      className="w-full accent-secondary cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Persistencia:</span>
                      <strong className="text-secondary">{productForm.persistence}</strong>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={productForm.persistence}
                      onChange={(e) =>
                        setProductForm({ ...productForm, persistence: parseFloat(e.target.value) })
                      }
                      className="w-full accent-secondary cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#38221b] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded text-primary-fixed-dim hover:text-surface text-xs font-label-md uppercase tracking-wider cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-secondary text-on-secondary hover:bg-on-tertiary-container text-xs font-label-md uppercase tracking-wider font-semibold transition-colors shadow-md cursor-pointer"
                >
                  {isNewProduct ? 'Guardar Nuevo Producto' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-secondary text-on-secondary px-4 py-3 rounded-lg shadow-2xl font-label-md text-xs uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2 border border-secondary-fixed/40">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
