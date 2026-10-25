import { Product, SiteData } from '../types';

export const DEFAULT_SITE_DATA: SiteData = {
  brand: {
    name: 'Fernandina de Jagua',
    subName: 'Chocolates',
    tagline: 'Chocolatería artesanal en San Miguel',
    companyName: 'EBYZOM E.I.R.L.',
    address: 'Jr. Comandante Juan Guillermo Moore 296',
    district: 'San Miguel, Lima — Perú',
    zone: 'San Miguel • Lima Oeste',
    whatsappNumber: '906 591 037',
    whatsappUrl: 'https://wa.me/51906591037',
    googleMapsUrl: 'https://maps.google.com/?q=Jr.+Comandante+Juan+Guillermo+Moore+296,+San+Miguel,+Lima,+Peru',
    logoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XgS194rmpMVmsu7ZxJSU6rRsFuHF4O8B_zRNENRfuSs_oagXruylRTI0SDMiVqCf8axjQMwCjdGsE9g77u-YnjoRnv4bCv98XOkAkagt_y4NuC6phODGZ_zYkV9J1qBBRk5xFp2ZjxO9AVAHy49m7GnjltmucYDMHLYheSBjgfhrfHyRuHnwfy4e2d8Ocr948vMoRsGNeArBktKJoQ3DLaC1--lS3KRhsaq-EitSE2uDno7SfGM7AvySy7ERESR-ic4PpvrP6PBQ',
    heroBgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZO0SjunW9PAM3zWRiNq7OSnY_dJm7_U4n5GsUWKJcnHBv9qz8B-hvYPkwJRtEvJJPXCho89DAJGxEM4_WEK4DHdipXh_ldRQalHJqZhEqQtD4cMu4-NxsTG5kCV8pGnFB-jNnGMpir_DvAI8B5f_SAbwnmZ1YKEIlmYkCm9ZZVP1hhUGN9iENBDjcZyaGuUtkG3dRTJy7cwYP6a2Dwi8Jp2XNXKzi-P-BOrkJHFGeidhZe3DHEWRn',
    mapImageUrl: '',
    ambientImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4dgKAy6-Uoz3AoGJtobWTTMTCL8LPpZprPRGBNgI4xDwn0jJ0oT0y89CDc0hKvnAVv3kFkUZ6dgYkpltXl2p34FSFjmzDC0SCX4d50t56N-fkXuZaz0aSw6GmDy0x1pOAVoQy5UOvv64MSXY9fOTdK5MrhUHtp1ghPSZWmLRJ1AEPbNNTH0CYRQnPajoV26BrqcJ9FpZHwSoFUOmLE_FWpS6zwJhTS2uEIUDrbziYtnhT4bt2zjh0',
  },
  home: {
    heroOverline: 'San Miguel · Lima',
    heroTitle: 'Fernandina de Jagua',
    heroSubtitle: 'Chocolatería artesanal en San Miguel',
    heroDesc: 'Elaboraciones cuidadas con pureza de origen, molienda paciente y devoción por los perfiles sensoriales de nuestro cacao.',
    heroBadge1: 'Grano seleccionado',
    heroBadge2: 'Tostado pausado',
    heroBadge3: 'Sin aditivos artificiales',
    collectionOverline: 'Colección Principal',
    collectionTitle: 'Nuestras Creaciones',
    collectionDesc: 'Piezas concebidas mediante temperado meticuloso y armonía entre textura, acidez natural y dulzor moderado.',
    featuredProductIds: ['barra-70-cacao-origen', 'bombones-artesanales-surtidos', 'tableta-sal-de-maras'],
    howToOrderOverline: 'Compra en línea',
    howToOrderTitle: 'Elige, paga y coordina',
    howToOrderDesc: 'Compra directamente desde el catálogo de esta web, paga con tarjeta o Yape mediante Culqi y luego coordinamos contigo el envío o recojo.',
    option1Title: 'En nuestra aplicación móvil',
    option1Desc: 'Diseñada específicamente para dispositivos Android. Consulta el catálogo completo, lotes frescos del día y coordina tus entregas de forma ágil y cómoda.',
    option2Title: 'Directamente por WhatsApp',
    option2Desc: 'Conversa con nosotros para coordinar pedidos a medida, consultas sobre fechas de producción o coordinar entregas inmediatas en Lima.',
    visitOverline: 'Ubicación y Espacio',
    visitTitle: 'Visítanos en San Miguel',
    visitDesc: 'Te invitamos a conocer el espacio donde formulamos y atemperamos cada lote de chocolate. Un rincón dedicado al aroma profundo del grano y al intercambio tranquilo en el corazón de San Miguel.',
  },
  catalog: {
    catalogOverline: 'Catálogo Exclusivo · San Miguel, Lima',
    catalogTitle: 'Nuestra Colección de Chocolates',
    catalogNotice: 'Puedes pagar en línea con tarjeta o Yape desde esta misma web, o coordinar tu pedido por nuestra aplicación oficial de Android o por WhatsApp.',
    orderBannerTitle: '¿Cómo ordenar tus chocolates favoritos?',
    orderBannerDesc: 'Compra en línea con tarjeta o Yape y coordinamos la entrega contigo, o atiéndete de forma personalizada por nuestro WhatsApp oficial al 906 591 037 y nuestra aplicación oficial de Android.',
  },
  visit: {
    headerTag: 'Atelier & Cacao en Lima',
    headerTitle: 'Encuéntranos en San Miguel',
    headerDesc: 'Un enclave en la costa limeña concebido para el encuentro personal, el retiro de encargos finos y la exploración de notas aromáticas de nuestra chocolatería.',
    scheduleTitle: 'Horario de atención',
    schedulePlaceholder: 'Lunes a Sábado: 10:00 am – 7:00 pm
Domingos y feriados: 11:00 am – 5:00 pm',
    scheduleNotice: 'Horarios sujetos a cambio en temporadas especiales. Para visitas privadas y retiro de encargos finos, conúctenos previamente por WhatsApp.',
    ref1Title: 'Eje Costero',
    ref1Subtitle: 'Costa Verde & Av. Costanera',
    ref1Desc: 'Accesible rápidamente desde el circuito de playas y la avenida Costanera, ascendiendo por las vías transversales hacia el corazón tradicional de San Miguel.',
    ref2Title: 'Avenidas Principales',
    ref2Subtitle: 'Av. La Paz & Av. Libertad',
    ref2Desc: 'Ubicado a pocas cuadras del corredor de la Av. La Paz, en un entorno residencial sereno que permite estacionamiento rápido para retiros breves.',
    ref3Title: 'Entorno de Recepción',
    ref3Subtitle: 'Numeración & Fachada 296',
    ref3Desc: 'Identifique el número 296 sobre el Jr. Comandante Juan Guillermo Moore. Para retiros de lotes o colecciones reservadas, toque el timbre correspondiente.',
    ctaTitle: '¿Desea coordinar una selección previa a su visita?',
    ctaDesc: 'Puede hacernos llegar sus preferencias o solicitar asesoría para regalos institucionales y personales con antelación a través de nuestro WhatsApp oficial.',
  },
  products: [
    {
      id: 'barra-70-cacao-origen',
      name: 'Barra Gran Cacao 70% Origen',
      subtitle: 'Origen Seleccionado',
      category: 'puras',
      categoryLabel: 'Barras Puras',
      badge: 'Cacao 70%',
      badgeColor: 'primary',
      price: 'S/ 18.00',
      priceValue: 18,
      shortDesc: 'Notas profundas de frutos rojos secos, ligero toque floral y final a roble tostado.',
      fullDesc: 'Elaborada con granos seleccionados de cacao peruano finamente tostados y refinados. Revela un perfil aromático equilibrado con notas profundas a frutos secos y un final prolongado y suave en boca.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzfn5-EatkC0GTOTODeigjbf8UwZevZ8kHwK4PRlHBsvChOrH1ew8-_tXhWtimZ9lGOhqwSHq5ajFwkKnu8mO3Fen_zdzz2qHgUOwzZ35h30pkl0gn82gpgLzXVMjj5WtT6PAGCk0HSigpuSGurUz8WUcQUsrovAsgaDXYVzAde1sfYh7lKoyZW00tzyBvfEXotle6m9M9yYd_v_kzM5OTzi3mYD_qaTFebAZPyCXlohpndZPPW0YB',
      detailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGhmDQOOIZMnPOKG7142iBfX4CcFFXbwXUREKNrkDCSqB99cRmVPv8TTsb1H_saR3LlrOfxmzXTfzQYqgr9Oj4MNDH3mzqakb1o7BHe8T45Ri61AKHvZh3iqPoOlKWyVnQPMZwJjZ-6VkT9yuZZropZDg8CK7RDHrY_LNdWHaSWxld8NdRgGvh5VwxNY-S6iXYWjufnacYOXXShMur0oOJFuSizC_5t0ZKJAXnkqEvrsWs5d0Yp9Dk',
      ingredients: 'Pasta de cacao, manteca de cacao y panela orgánica.',
      netWeight: '80 gramos',
      aromaProfile: 'Frutos secos, madera noble y miel tibia',
      conservation: '16°C – 19°C · Lugar fresco y seco',
      origin: 'Cacao Peruano Seleccionado · San Miguel, Lima',
      intensity: 4.5,
      intensityDesc: 'Carácter de tostado balanceado sin amargor agresivo.',
      fruitNotes: 3.8,
      fruitNotesDesc: 'Matices a pasas rubias y frutos secos caramelizados.',
      persistence: 4.8,
      persistenceDesc: 'Despliegue envolvente y retrogusto untuoso de cacao noble.',
    },
    {
      id: 'bombones-artesanales-surtidos',
      name: 'Bombones Artesanales Surtidos',
      subtitle: 'Rellenos Nobles',
      category: 'bombones',
      categoryLabel: 'Bombones & Trufas',
      badge: 'Selección',
      badgeColor: 'secondary',
      price: 'S/ 32.00',
      priceValue: 32,
      shortDesc: 'Ganache de maracuyá, praliné de avellanas crocantes y caramelo con infusión de vainilla.',
      fullDesc: 'Caja de piezas facetadas a mano con pinceladas doradas. Cada bombón conjuga una fina capa exterior de cacao al 65% con centros aromáticos que van desde pulpa de maracuyá reducida hasta praliné tostado en piedra.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqqXN-7FJmryt3O4Cvxhtw_ytdztIDE0UAdFiI8mNvApeSFx_d52Qh2noNTUaq71MuEHo59YhDMrrschRfYMj0qTNiQam_diaTwzrohNPOEisT84IBsbQj-b3v95XfdS1r0qDSdDYhp49D900zaZzk9x2JnkSrFIsq8LLyg3HWr9aEz0Sf3gzWn0Sqet2qw1dxipUm_PNhFZOCqzQB4uur6BLstDNBV5IcRpUUxaNRqBfObkjeN0Li',
      detailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL-EjW4LAP0xQidxF0GjyMCbSpvpnqlafbUG1HFZxAQpy_GhH1wEMXRSJOfssnOeDc_ePpGNxDfurBstnJYtpz1HSrKhloXyRXsFa4j8LQf3TE13WpJHJnly7uAs7rYN05E84h7c4xa10XN7D2RsCLl9CmI9U8rIzrzFExaaiGCaX5metbaze8Zpz5htimEk1FECgSZf3RqcZtjtdc8XGaaDbTd31tnGscikJBwSrGrJmmZDcUAlc4',
      ingredients: 'Cobertura de cacao 65%, pulpa de maracuyá, crema de leche fresca, avellanas tostadas y vainilla de convento.',
      netWeight: '12 unidades (140g aprox.)',
      aromaProfile: 'Acidez tropical, praliné tostado y caramelo dorado',
      conservation: '15°C – 18°C · Consumo preferente dentro de los 21 días',
      origin: 'Valle de Chanchamayo y Quillabamba',
      intensity: 3.9,
      intensityDesc: 'Equilibrio sedoso entre la potencia del cacao y el dulzor de fruta natural.',
      fruitNotes: 4.7,
      fruitNotesDesc: 'Explosión cítrica y aromática de maracuyá de huerto fresco.',
      persistence: 4.4,
      persistenceDesc: 'Sensación aterciopelada y cremosidad duradera en paladar.',
    },
    {
      id: 'chocolate-oscuro-frutos-secos',
      name: 'Chocolate Oscuro con Frutos Secos',
      subtitle: 'Textura & Grano',
      category: 'frutas',
      categoryLabel: 'Cacao & Frutas',
      badge: 'Cacao 60%',
      badgeColor: 'primary',
      price: 'S/ 22.00',
      priceValue: 22,
      shortDesc: 'Almendras tostadas enteras, pistachos seleccionados y un balance crujiente excepcional.',
      fullDesc: 'Elaborado con frutos secos levemente dorados al horno para despertar sus aceites esenciales naturales, integrados a una base de chocolate negro untuoso de acidez equilibrada.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF6WthTtmWA9PvTmj0LDSmMaHbG1_D8ESXnKM7yrQsOQfA8QP40g8ZcjQm1k7c0iZ1iRYgBWqPAj8fRgV8CgXOsaqNeNWUESGVBx2jQweb_WTRpBBnX2lVYAYuuQ_xwc3-fbuFJVkxgjIjiAAlK_TkYsZ1nZxR1P4-A2r6lIlNWYjDardqnjk4IxtOJL3POImQnjGEneTRsiV2_jmYGPtCiBKL8UH86xfPH5Kei7yiu6T_A3fNAlP9',
      ingredients: 'Pasta de cacao 60%, azúcar de caña integral, almendras tostadas, pistachos pelados y arándanos deshidratados.',
      netWeight: '90 gramos',
      aromaProfile: 'Frutos tostados, aceites nobles y madera ligera',
      conservation: '16°C – 20°C · Lugar fresco y libre de humedad',
      origin: 'Cacao San Martín y frutos secos andinos',
      intensity: 4.0,
      intensityDesc: 'Cuerpo untuoso con contraste crujiente de alta satisfacción.',
      fruitNotes: 3.5,
      fruitNotesDesc: 'Destellos de arándanos silvestres con suave acidez.',
      persistence: 4.2,
      persistenceDesc: 'Retrogusto tostado de frutos secos y cacao templado.',
    },
    {
      id: 'barra-85-cacao-intenso',
      name: 'Barra 85% Cacao Intenso',
      subtitle: 'Perfil Puro',
      category: 'puras',
      categoryLabel: 'Barras Puras',
      badge: 'Cacao 85%',
      badgeColor: 'primary',
      price: 'S/ 19.00',
      priceValue: 19,
      shortDesc: 'Potente carácter tánico con notas terrosas, tabaco rubio y retrogusto persistente.',
      fullDesc: 'Una experiencia sin concesiones para paladares experimentados. Mínima adición de azúcar de caña orgánica para resaltar la pureza vegetal y la potencia mineral del grano virgen.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwaMQUUOxU2iPvCRPwvZNXvGoZo-dHJnAQ5fw8Si3nKMFBq0CsqgSNJwuGG4rWYjIKWnorsQTpiLnovRPLYtDKx-BdxiJyRL7l5ubsLAacQhQsh0wH5ONTnOYx5dgiJtRvZpkIDgRkqp_SJTiin7vvfJW3PpsVoDuDvP8DSKvHKN1zk18y43YLMMU-zya3MQyU146BDR7gNCYQnu_5sfcp5fMU0BD9jSegwvo12l8HCf51DVvyCjLs',
      detailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1YJP6spZPVkdxvVfCCJxkCeL7O8ExpC3W9aoIvDhd4grcJba_GyljHhoXuww6meKjxzHaNZKwcjGjUeA7Yq0-jujEg126Ru2KXITsal8mJFcQCjJTinVl9phZGn4HglxwFe4_8v6SHhGTWq9jg_p87E5mJi38OD-NbV2SoofCZk2JQopnk9HmSHB9HFPFf2eY-66FdEDmIlrvr4XNWeMlezaKrUit4PaXXLhRxBABjEjCIogSeen8',
      ingredients: 'Granos de cacao 85%, manteca pura de cacao y 15% de panela orgánica de Piura.',
      netWeight: '80 gramos',
      aromaProfile: 'Humo dulce, tabaco rubio, cuero y tierra húmeda',
      conservation: '15°C – 19°C · Lugar fresco y seco',
      origin: 'Cacao Nativo Blanco de Piura',
      intensity: 4.9,
      intensityDesc: 'Fuerza astringente controlada y notas tónicas muy marcadas.',
      fruitNotes: 2.9,
      fruitNotesDesc: 'Notas secas de higo y mora silvestre.',
      persistence: 5.0,
      persistenceDesc: 'Máxima duración en boca; presencia vegetal inconfundible.',
    },
    {
      id: 'trufas-cafe-canela',
      name: 'Trufas de Café y Canela',
      subtitle: 'Infusión Especial',
      category: 'bombones',
      categoryLabel: 'Bombones & Trufas',
      badge: 'Aromático',
      badgeColor: 'secondary',
      price: 'S/ 26.00',
      priceValue: 26,
      shortDesc: 'Corazón cremoso emulsionado con café de altura y un toque sutil de canela ceilán.',
      fullDesc: 'Textura untuosa que se funde en boca de manera inmediata. Emulsión lenta de crema fresca, reducción de café arábica y velo exterior de cacao puro con canela espolvoreada.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApp9i2J-C8ZnA7RIP2KiR9Lfc_kZiddrrfRrfboMbThbur9P9ngZUwupBfXKWmw_SKRaCQ2gzq84gFMsqICwPbTW8Qx4EwOQeNC4a50OqzPyGT0tS7XAT8T-ldrpwId2SiI3yf6uKDoLwW7z0evIa1I9xPjEWiVFXek5L3rFczNoSZhaLGhVyPw1ZRAQlAfv7TFpjVb1wE8W8qFztjEjAJxrSfGqSeseK4mfFHj7DEYbqd1zNejII8',
      ingredients: 'Cacao al 70%, extracto concentrado de café de Villa Rica, crema de leche de pastura, canela de Ceilán molida.',
      netWeight: '8 unidades (110g)',
      aromaProfile: 'Café tostado, canela en rama y crema dulce',
      conservation: '14°C – 18°C · Mantener refrigerado si la temperatura ambiente supera 22°C',
      origin: 'Cacao Junín y Café Villa Rica',
      intensity: 4.2,
      intensityDesc: 'Fusión envolvente de café tostado y chocolate denso.',
      fruitNotes: 3.1,
      fruitNotesDesc: 'Matices a ciruela pasa y notas especiadas cálidas.',
      persistence: 4.6,
      persistenceDesc: 'El café y la canela perduran de forma noble y tibia.',
    },
    {
      id: 'tableta-sal-de-maras',
      name: 'Tableta con Sal de Maras',
      subtitle: 'Contraste Andino',
      category: 'especialidades',
      categoryLabel: 'Especialidades',
      badge: 'Cacao 68%',
      badgeColor: 'primary',
      price: 'S/ 20.00',
      priceValue: 20,
      shortDesc: 'Cristales minerales rosados que potencian los tonos acaramelados del cacao tibio.',
      fullDesc: 'La pureza de la sal recolectada artesanalmente en las salineras de Maras contrasta magistralmente con el perfil tostado y redondo de nuestro chocolate oscuro al 68%.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtjvqiC1RcMrQdkyP7Yf9w62rkIHOM4Jgn0Il3klI55dtJU6zJ8x3iLaJ5GzhJ7RMAunTfKel9wrw2I4bku8rcb9YlcGtvBB1KcIf4f18VYln8OQlfNGzeEoIDnQEm2ncUwpLLijXArxLgDJQUDrnp3VAUPC7FT011GGD39yqrmID70w84oMaECDPDTmV28YION8UQGSHpb5cSk0q27Z6eOewMJKmjGI2SYhpdmg4PZKdglQ3YMGbW',
      detailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Y7UgItNwbHvVgJ9cQAqtvrsOYIwYG5yh0k2NSwmcS1boLfqQOg0csuqP-J9BUVoYkad2T3RfNtsvg4o0mRfhHb1GFNjFdnqYP94T6ye14s2E7q438AGF6bwIuj57BDR58VFWzMeaZ6Xm6Bz2zsDGRmYPVb03Qk9cphFtl5wZcHw5l4E6fYs1QoEeeVtD51bZbBdYuuVxk5g6WJq53Id_X8sKNlDaOStKjylSCS4ZD59nc0_No7Ua',
      ingredients: 'Pasta de cacao 68%, azúcar orgánica de caña, manteca de cacao, flor de sal rosada de Maras (Cusco).',
      netWeight: '80 gramos',
      aromaProfile: 'Mineral salino, cacao tostado y caramelo moreno',
      conservation: '16°C – 19°C · Lugar fresco y seco',
      origin: 'Cacao Cusco y Salineras de Maras',
      intensity: 4.3,
      intensityDesc: 'El grano de sal intensifica las notas de mantequilla de cacao.',
      fruitNotes: 3.4,
      fruitNotesDesc: 'Acentúa notas a higo seco y miel de chancaca.',
      persistence: 4.7,
      persistenceDesc: 'Contraste mineral cristalino que limpia y aviva el paladar.',
    },
    {
      id: 'nibs-cacao-acaramelados',
      name: 'Nibs de Cacao Acaramelados',
      subtitle: 'Textura Pura',
      category: 'especialidades',
      categoryLabel: 'Especialidades',
      badge: 'Crujiente',
      badgeColor: 'secondary',
      price: 'S/ 16.00',
      priceValue: 16,
      shortDesc: 'Trozos de grano tostado envueltos en una micro-capa de caramelo rubio artesanal.',
      fullDesc: 'Nibs seleccionados tostados al punto justo para mantener su complejidad botánica, recubiertos por una sutil película crujiente de azúcar de caña morena.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-6P_kOVFE8noc3OCKjWuUGRfNP-n-lBtVDsLLF0iLM1jgeBwTZPvuiKVN3a_r4W2VWMfi3-X7ZyLD3hQ4MJ4LTwEYXWXg0vE1PS9mb2MDqE14B7gFGVX7cwtdZUTe4WNA_3h-5be0PMa8PB_wO2qsEuAaOkKtJg45kYQ0-dxEejEq2J5dhPmhudaBGqkyvU5b21qnRN4hHkE4Iqa9m74-i7urUX3W3idvvj8CDPJS3liC_5BXYjO9',
      ingredients: 'Nibs de cacao nativo tostado 80%, azúcar rubia de caña 20%.',
      netWeight: '100 gramos',
      aromaProfile: 'Tostado intenso, nuez y caramelo dorado',
      conservation: 'Ambiente fresco y seco en envase hermético',
      origin: 'San Martín, Perú',
      intensity: 4.1,
      intensityDesc: 'Crocancia directa con el amargor botánico del grano puro.',
      fruitNotes: 2.8,
      fruitNotesDesc: 'Matices maderosos con dulzor de caramelo de paila.',
      persistence: 4.3,
      persistenceDesc: 'Crujido sonoro y regusto largo a cacao campesino.',
    },
    {
      id: 'chocolate-fruta-amazonica',
      name: 'Chocolate con Relleno de Fruta Amazónica',
      subtitle: 'Fruta Autóctona',
      category: 'frutas',
      categoryLabel: 'Cacao & Frutas',
      badge: 'Cacao 72%',
      badgeColor: 'primary',
      price: 'S/ 24.00',
      priceValue: 24,
      shortDesc: 'Coulis natural de aguaje y camu-camu con acidez vibrante en cobertura intensa.',
      fullDesc: 'Equilibrio maestro entre la alta concentración de polifenoles del cacao nativo y la frescura ácida de frutos amazónicos recolectados de manera sostenible en comunidades nativas.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABBj0JQeMIhEh1jzR1w8LIJMMOpu3_HdlLar720GJv83vFADWt4uAAPP_ex5oFLGEAdpr4ddu8LmkAr8gDp6ERmcHH7I1faF1bVKbsV6C5r8823s2QmoSssSIm4jvkMiabhehkPk2ddN5-BgBsesUyERIKBMpFWGvPV6vOECXfPMppmHkKjF0rrDZKGtX_yFNsSUkAkfk7GNqPICsViDp4LUYz5HyY0bgFlQaVcwwjRxv6LKndmCAY',
      ingredients: 'Pasta de cacao 72%, manteca de cacao, pulpa de camu-camu y aguaje silvestre, panela orgánica.',
      netWeight: '80 gramos',
      aromaProfile: 'Acidez punzante de selva baja, fruta amarilla y cacao oscuro',
      conservation: '15°C – 18°C · Lugar fresco',
      origin: 'Ucayali y Loreto, Amazonía Peruana',
      intensity: 4.4,
      intensityDesc: 'Acidez vivaz que corta la densidad de la manteca de cacao.',
      fruitNotes: 4.9,
      fruitNotesDesc: 'Vitamina C natural y astringencia frutal electrizante.',
      persistence: 4.5,
      persistenceDesc: 'Sensación fresca y frutal prolongada.',
    },
  ],
};

const STORAGE_KEY = 'fernandina_site_cms_data_v1';
const PASS_KEY = 'fernandina_cms_admin_key';
const DEFAULT_PASS = 'admin123';

export function loadStoredSiteData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_DATA;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.brand && parsed.products && Array.isArray(parsed.products)) {
      const brand = { ...DEFAULT_SITE_DATA.brand, ...(parsed.brand || {}) };
      if (/^chocolates(?:\s*[·•]\s*san miguel)?$/i.test(brand.subName.trim())) {
        brand.subName = 'Chocolates';
      }
      return {
        ...DEFAULT_SITE_DATA,
        ...parsed,
        brand,
        home: { ...DEFAULT_SITE_DATA.home, ...(parsed.home || {}) },
        catalog: { ...DEFAULT_SITE_DATA.catalog, ...(parsed.catalog || {}) },
        visit: { ...DEFAULT_SITE_DATA.visit, ...(parsed.visit || {}) },
        products: parsed.products.length > 0 ? parsed.products : DEFAULT_SITE_DATA.products,
      };
    }
  } catch (e) {
    console.error('Failed to load site data from localStorage', e);
  }
  return DEFAULT_SITE_DATA;
}

export function saveStoredSiteData(data: SiteData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save site data to localStorage', e);
  }
}

export async function loadRemoteSiteData(): Promise<SiteData | null> {
  try {
    const response = await fetch(`/api/cms/site?catalogVersion=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
    });
    if (response.status === 404) return null;
    const result = await response.json();
    if (!response.ok || !result.success || !result.data?.brand || !Array.isArray(result.data.products)) {
      throw new Error(result.error || 'No se pudo cargar el catálogo compartido.');
    }
    const parsed = result.data as SiteData;
    const normalized: SiteData = {
      ...DEFAULT_SITE_DATA,
      ...parsed,
      brand: { ...DEFAULT_SITE_DATA.brand, ...(parsed.brand || {}) },
      home: { ...DEFAULT_SITE_DATA.home, ...(parsed.home || {}) },
      catalog: { ...DEFAULT_SITE_DATA.catalog, ...(parsed.catalog || {}) },
      visit: { ...DEFAULT_SITE_DATA.visit, ...(parsed.visit || {}) },
      // Un arreglo vacío es una decisión válida del CMS: no reintroducir ejemplos.
      products: parsed.products,
    };
    saveStoredSiteData(normalized);
    return normalized;
  } catch (error) {
    console.warn('Catálogo compartido no disponible; se mantiene el catálogo local.', error);
    return null;
  }
}

export async function saveRemoteSiteData(data: SiteData, password: string): Promise<void> {
  const response = await fetch('/api/cms/site', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-cms-password': password },
    body: JSON.stringify({ data }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'No se pudo guardar el catálogo compartido.');
  }
}

export function resetStoredSiteData(): SiteData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to remove stored site data', e);
  }
  return DEFAULT_SITE_DATA;
}

export async function verifyAdminPassword(input: string): Promise<boolean> {
  try {
    const response = await fetch('/api/cms/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: input }),
    });
    return response.ok;
  } catch {
    const current = localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
    return input.trim() === current.trim();
  }
}

export function updateAdminPassword(newPass: string): void {
  localStorage.setItem(PASS_KEY, newPass.trim());
}
