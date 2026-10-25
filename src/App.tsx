import React, { useState, useEffect } from 'react';
import { PageRoute, Product, SiteData } from './types';
import {
  loadStoredSiteData,
  loadRemoteSiteData,
  saveRemoteSiteData,
  saveStoredSiteData,
  resetStoredSiteData,
} from './data/cmsStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { VisitUsView } from './views/VisitUsView';
import { AdminView } from './views/AdminView';
import { ProductModal } from './components/ProductModal';
import { ConciergeModal } from './components/ConciergeModal';
import { PrivacyModal } from './components/PrivacyModal';
import { ReclamacionesModal } from './components/ReclamacionesModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import {
  addToCart,
  cartCount,
  cartTotal,
  CartItem,
  loadCart,
  removeFromCart,
  saveCart,
  updateCartQuantity,
} from './lib/cart';

export default function App() {
  const [siteData, setSiteData] = useState<SiteData>(() => loadStoredSiteData());
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('inicio');
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => siteData.products[0]);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [conciergeModalOpen, setConciergeModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [reclamacionesModalOpen, setReclamacionesModalOpen] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCart());
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartToast, setCartToast] = useState<string | null>(null);
  // La sesión anterior no conserva la contraseña necesaria para sincronizar Firestore.
  // Se solicita un nuevo login después de activar el CMS remoto.
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [cmsPassword, setCmsPassword] = useState('');

  useEffect(() => {
    let cancelled = false;
    loadRemoteSiteData().then((remoteData) => {
      if (cancelled || !remoteData) return;
      setSiteData(remoteData);
      if (remoteData.products.length > 0) setSelectedProduct(remoteData.products[0]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Save changes to localStorage whenever siteData updates
  const handleUpdateSiteData = (newData: SiteData) => {
    setSiteData(newData);
    saveStoredSiteData(newData);
    if (cmsPassword) {
      saveRemoteSiteData(newData, cmsPassword).catch((error) => {
        console.error('No se pudo sincronizar el CMS con Firestore:', error);
      });
    }
    // Keep selected product in sync if updated
    if (selectedProduct) {
      const refreshed = newData.products.find((p) => p.id === selectedProduct.id);
      if (refreshed) {
        setSelectedProduct(refreshed);
      } else if (newData.products.length > 0) {
        setSelectedProduct(newData.products[0]);
      }
    }
  };

  const handleResetData = () => {
    const defaultData = resetStoredSiteData();
    setSiteData(defaultData);
    if (defaultData.products.length > 0) {
      setSelectedProduct(defaultData.products[0]);
    }
  };

  const persistCart = (items: CartItem[]) => {
    setCartItems(items);
    saveCart(items);
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    persistCart(addToCart(cartItems, product, quantity));
    setCartToast(`${product.name} agregado al carrito`);
    window.setTimeout(() => setCartToast(null), 2600);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    persistCart(updateCartQuantity(cartItems, productId, quantity));
  };

  const handleRemoveFromCart = (productId: string) => {
    persistCart(removeFromCart(cartItems, productId));
  };

  const handleOpenCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handlePaid = () => {
    persistCart([]);
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
  };

  const handleRouteChange = (route: PageRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentRoute('producto-detalle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductModal = (product: Product) => {
    setModalProduct(product);
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setCurrentRoute('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAdminLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = async (password: string) => {
    setCmsPassword(password);
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('fernandina_admin_session', 'active');
    setAdminLoginModalOpen(false);
    setCurrentRoute('admin');
    try {
      // Migra al servidor cualquier producto que solo existía en el escritorio.
      await saveRemoteSiteData(siteData, password);
    } catch (error) {
      console.error('No se pudo inicializar el catálogo compartido:', error);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCmsPassword('');
    sessionStorage.removeItem('fernandina_admin_session');
    setCurrentRoute('inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on admin view and logged in, render the full CMS panel
  if (currentRoute === 'admin' && isAdminLoggedIn) {
    return (
      <AdminView
        siteData={siteData}
        onUpdateSiteData={handleUpdateSiteData}
        onResetData={handleResetData}
        onExitAdmin={() => handleRouteChange('inicio')}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface antialiased selection:bg-secondary/20 selection:text-secondary">
      {/* Header bar */}
      <Header
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
        onOpenConcierge={() => setConciergeModalOpen(true)}
        brand={siteData.brand}
        cartCount={cartCount(cartItems)}
        cartSubtotal={cartTotal(cartItems)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Main viewport */}
      <main className="w-full pt-20 bg-surface flex-1">
        {currentRoute === 'inicio' && (
          <HomeView
            siteData={siteData}
            onRouteChange={handleRouteChange}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute === 'productos' && (
          <CatalogView
            siteData={siteData}
            onSelectProduct={handleSelectProduct}
            onOpenProductModal={handleOpenProductModal}
            onAddToCart={(product) => handleAddToCart(product)}
            onOpenCart={() => setCartOpen(true)}
          />
        )}

        {currentRoute === 'producto-detalle' && (
          <ProductDetailView
            product={selectedProduct}
            siteData={siteData}
            onRouteChange={handleRouteChange}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(product, quantity) => handleAddToCart(product, quantity)}
          />
        )}

        {currentRoute === 'visitanos' && (
          <VisitUsView
            siteData={siteData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onRouteChange={handleRouteChange}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenReclamaciones={() => setReclamacionesModalOpen(true)}
        brand={siteData.brand}
      />

      {/* Floating Admin Toolbar when session is active */}
      {isAdminLoggedIn && currentRoute !== 'admin' && (
        <div className="fixed bottom-4 left-4 z-40 bg-[#241713] text-surface-bright px-3.5 py-2.5 rounded-xl shadow-2xl border border-secondary/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>CMS Activo</span>
          </div>
          <button
            onClick={() => handleRouteChange('admin')}
            className="px-2.5 py-1 rounded bg-secondary text-on-secondary text-xs font-label-md uppercase tracking-wider hover:bg-on-tertiary-container transition-colors cursor-pointer"
          >
            Editar Sitio
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-primary-fixed-dim hover:text-surface cursor-pointer"
            title="Cerrar sesión de administrador"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <ProductModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onGoToDetail={(prod) => {
          handleSelectProduct(prod);
        }}
        brand={siteData.brand}
        onAddToCart={(prod) => {
          handleAddToCart(prod);
          setModalProduct(null);
          setCartOpen(true);
        }}
      />

      <ConciergeModal
        isOpen={conciergeModalOpen}
        onClose={() => setConciergeModalOpen(false)}
        brand={siteData.brand}
      />

      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <ReclamacionesModal
        isOpen={reclamacionesModalOpen}
        onClose={() => setReclamacionesModalOpen(false)}
        brand={siteData.brand}
      />

      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        brand={siteData.brand}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleOpenCheckout}
        onKeepShopping={() => {
          setCartOpen(false);
          handleRouteChange('productos');
        }}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        items={cartItems}
        brand={siteData.brand}
        onClose={handleCloseCheckout}
        onPaid={handlePaid}
      />

      {cartToast && (
        <div className="fixed bottom-20 right-4 z-[65] max-w-xs bg-primary-container text-surface-bright px-space-sm py-space-xs rounded-xl shadow-2xl border border-secondary/50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-secondary-fixed text-[18px]">check_circle</span>
          <span className="font-body-sm text-body-sm">{cartToast}</span>
        </div>
      )}
    </div>
  );
}
