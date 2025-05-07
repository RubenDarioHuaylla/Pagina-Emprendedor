const productos = [
  {
    id: 1,
    nombre: "Blusa Artesanal",
    precio: 45,
    categoria: "Ropitas",
    descripcion: "Blusa bordada a mano con diseños tradicionales peruanos.",
    imagen: "https://donmax.net/cdn/shop/files/603962.jpg?v=1723676651",
    emprendedor: {
      id: 101,
      nombre: "María López",
      descripcion: "Artesana textil con más de 10 años de experiencia",
      avatar: "https://picsum.photos/id/64/100/100"
    },
    valoracion: 4.6,
    comentarios: [
      { usuario: "Carolina", texto: "La tela es de excelente calidad", fecha: "2025-04-10" },
      { usuario: "Pedro", texto: "Los bordados son hermosos", fecha: "2025-04-15" }
    ]
  },
  {
    id: 2,
    nombre: "Ceviche Clásico",
    precio: 25,
    categoria: "Comida",
    descripcion: "Ceviche fresco preparado con pescado del día, limón y ají.",
    imagen: "https://cdn0.recetasgratis.net/es/posts/7/4/1/ceviche_peruano_18147_orig.jpg",
    emprendedor: {
      id: 102,
      nombre: "Juan Pérez",
      descripcion: "Chef especializado en gastronomía peruana",
      avatar: "https://picsum.photos/id/65/100/100"
    },
    valoracion: 4.8,
    comentarios: [
      { usuario: "Luisa", texto: "El mejor ceviche que he probado", fecha: "2025-04-20" },
      { usuario: "Alberto", texto: "Muy fresco y delicioso", fecha: "2025-04-22" }
    ]
  },
  {
    id: 3,
    nombre: "Smartwatch Local",
    precio: 120,
    categoria: "Tecnología",
    descripcion: "Reloj inteligente con medición de ritmo cardíaco y notificaciones.",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_877020-MPE81416315728_122024-O-smartwatch-hk10-ultra-3-4gb-chatgpt-amoled-202-bt-53.webp",
    emprendedor: {
      id: 103,
      nombre: "Roberto Gómez",
      descripcion: "Ingeniero electrónico e innovador tecnológico",
      avatar: "https://picsum.photos/id/66/100/100"
    },
    valoracion: 4.3,
    comentarios: [
      { usuario: "Diana", texto: "Buena duración de batería", fecha: "2025-04-01" },
      { usuario: "Miguel", texto: "La aplicación es intuitiva", fecha: "2025-04-05" }
    ]
  },
  {
    id: 4,
    nombre: "Pulsera de Plata",
    precio: 35,
    categoria: "Accesorios",
    descripcion: "Pulsera artesanal de plata con diseños geométricos.",
    imagen: "https://platinoperu.com/wp-content/uploads/2021/08/pulsera-dama-corazon-mio-plata-lima-miraflores-platinoperu2.jpg",
    emprendedor: {
      id: 104,
      nombre: "Sofía Torres",
      descripcion: "Artesana joyera con técnicas ancestrales",
      avatar: "https://picsum.photos/id/67/100/100"
    },
    valoracion: 4.7,
    comentarios: [
      { usuario: "Laura", texto: "Bellísima y de buena calidad", fecha: "2025-04-12" },
      { usuario: "Carlos", texto: "El acabado es perfecto", fecha: "2025-04-18" }
    ]
  },
  {
    id: 5,
    nombre: "Cerámica Decorativa",
    precio: 50,
    categoria: "Artesanías",
    descripcion: "Jarrón de cerámica pintado a mano con motivos andinos.",
    imagen: "https://previews.123rf.com/images/lestertair/lestertair1704/lestertair170401124/76849211-cer%C3%A1mica-decorativa-tradicional-turca-para-decoraci%C3%B3n-de-interiores.jpg",
    emprendedor: {
      id: 105,
      nombre: "Ana Castro",
      descripcion: "Ceramista con técnicas tradicionales",
      avatar: "https://picsum.photos/id/68/100/100"
    },
    valoracion: 4.9,
    comentarios: [
      { usuario: "Martín", texto: "Una pieza única y hermosa", fecha: "2025-04-08" },
      { usuario: "Elena", texto: "Los colores son vibrantes", fecha: "2025-04-14" }
    ]
  },
  {
    id: 6,
    nombre: "Mochila Artesanal",
    precio: 70,
    categoria: "Artesanías",
    descripcion: "Mochila tejida a mano con lana de alpaca y tintes naturales.",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_906689-MLA80560909972_112024-O.webp",
    emprendedor: {
      id: 106,
      nombre: "Rosa Mamani",
      descripcion: "Tejedora especializada en técnicas andinas",
      avatar: "https://picsum.photos/id/69/100/100"
    },
    valoracion: 4.5,
    comentarios: [
      { usuario: "Javier", texto: "Muy resistente y hermosa", fecha: "2025-04-25" },
      { usuario: "Camila", texto: "Los colores son exactamente como en la foto", fecha: "2025-04-28" }
    ]
  }
];
