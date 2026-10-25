export type PageRoute = 'inicio' | 'productos' | 'producto-detalle' | 'visitanos' | 'politica' | 'admin';

export type ProductCategory = 'puras' | 'bombones' | 'frutas' | 'especialidades';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  categoryLabel: string;
  badge: string;
  badgeColor?: 'primary' | 'secondary';
  price: string;
  priceValue: number;
  shortDesc: string;
  fullDesc: string;
  image: string;
  detailImage?: string;
  ingredients: string;
  netWeight: string;
  aromaProfile: string;
  conservation: string;
  origin: string;
  intensity: number; // 0 to 5
  intensityDesc: string;
  fruitNotes: number; // 0 to 5
  fruitNotesDesc: string;
  persistence: number; // 0 to 5
  persistenceDesc: string;
}

export interface BrandConfig {
  name: string;
  subName: string;
  tagline: string;
  companyName: string;
  ruc?: string;
  address: string;
  district: string;
  zone: string;
  whatsappNumber: string;
  whatsappUrl: string;
  googleMapsUrl: string;
  logoUrl: string;
  heroBgUrl: string;
  mapImageUrl: string;
  ambientImageUrl: string;
}

export interface HomeContent {
  heroOverline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  heroBadge1: string;
  heroBadge2: string;
  heroBadge3: string;
  collectionOverline: string;
  collectionTitle: string;
  collectionDesc: string;
  featuredProductIds: string[];
  howToOrderOverline: string;
  howToOrderTitle: string;
  howToOrderDesc: string;
  option1Title: string;
  option1Desc: string;
  option2Title: string;
  option2Desc: string;
  visitOverline: string;
  visitTitle: string;
  visitDesc: string;
}

export interface CatalogContent {
  catalogOverline: string;
  catalogTitle: string;
  catalogNotice: string;
  orderBannerTitle: string;
  orderBannerDesc: string;
}

export interface VisitContent {
  headerTag: string;
  headerTitle: string;
  headerDesc: string;
  scheduleTitle: string;
  schedulePlaceholder: string;
  scheduleNotice: string;
  ref1Title: string;
  ref1Subtitle: string;
  ref1Desc: string;
  ref2Title: string;
  ref2Subtitle: string;
  ref2Desc: string;
  ref3Title: string;
  ref3Subtitle: string;
  ref3Desc: string;
  ctaTitle: string;
  ctaDesc: string;
}

export interface SiteData {
  brand: BrandConfig;
  home: HomeContent;
  catalog: CatalogContent;
  visit: VisitContent;
  products: Product[];
}
