// Category describes the nature of the work; status describes its lifecycle.
export const projectCategories = { demos: "Demos", products: "Productos propios", clients: "Clientes" };
export const projectStatuses = { prototype: "Prototipo demostrativo", development: "En desarrollo", available: "Disponible", unverified: null };

export const projects = [
  {
    id: "verdesport",
    category: "demos",
    status: "prototype",
    featured: true,
    title: "VerdeSport",
    description: "Una tienda deportiva de demostración: explorar el catálogo, elegir productos y recorrer una compra simulada.",
    purpose: "Presentar un recorrido de e-commerce, desde la búsqueda de productos hasta el carrito y el checkout, sin procesar una compra real.",
    features: [
      "Catálogo local con búsqueda, filtros y ordenamiento.",
      "Carrito con talles, cantidades y límites de stock de demostración.",
      "Checkout simulado con selección de envío y resumen de compra.",
    ],
    decisions: [
      { title: "Estado compartido del carrito", text: "Context API centraliza productos, cantidades y totales para mantener el mismo estado entre el panel lateral, el carrito y el checkout." },
      { title: "Filtros separados de la interfaz", text: "Un hook y funciones de filtrado organizan la búsqueda y el ordenamiento. Los parámetros de la URL permiten abrir el catálogo con filtros iniciales." },
      { title: "Persistencia acotada", text: "El carrito se guarda en localStorage y se valida contra el catálogo al recuperarlo. El checkout finaliza una simulación, sin enviar pedidos." },
    ],
    technologies: ["React", "Context API", "React Router", "Tailwind CSS", "Framer Motion", "Vite"],
    limitations: "No procesa pagos ni envía pedidos. El catálogo y el stock son de demostración; el carrito se conserva únicamente en este navegador.",
    image: "/leostore.png",
    imageSources: "/projects/verdesport-960.webp 960w, /projects/verdesport-1600.webp 1600w",
    imageDefault: "/projects/verdesport-1600.webp",
    imageWidth: 1904,
    imageHeight: 943,
    imageAlt: "Inicio de VerdeSport, con navegación por indumentaria, aviso de modo demo, presentación deportiva y búsqueda de productos.",
    demo: "https://storeleo.vercel.app/",
    github: "https://github.com/LeoFerreiro/ecommerce-leo",
    evidence: {
      level: "source-reviewed",
      revision: "9966d948b64588fbccccd60f0b3a6b9d8f4ebc95",
      liveDemoVerified: false,
      files: ["src/components/Navbar.jsx", "src/components/DemoNotice.jsx", "src/context/CartContext.jsx", "src/utils/cartStorage.js", "src/hooks/useProductFilters.js", "src/utils/productFilters.js", "src/pages/Checkout.jsx", "src/services/api.js", "package.json"],
    },
  },
  {
  "id": "taskflow",
  "title": "TaskFlow",
  "description": "Un tablero de tareas de demostración, organizado por estados y conectado a una API propia de Node.js.",
  "purpose": "Explorar la organización de tareas en un tablero Kanban, con creación, edición y cambios de estado.",
  "features": [
    "Tablero por estados, con formularios para crear y editar tareas.",
    "Operaciones de tareas a través de endpoints de Node.js.",
    "Pantallas y endpoints de registro e inicio de sesión de demostración."
  ],
  "decisions": [
    {
      "title": "Separación entre interfaz y API",
      "text": "Los servicios del frontend concentran las solicitudes de tareas; el contexto distribuye el estado entre las vistas y el tablero."
    },
    {
      "title": "Dos formas de almacenamiento",
      "text": "El servidor local utiliza archivos JSON. La variante serverless conserva tareas y usuarios temporales en memoria, por lo que no garantiza persistencia durable."
    }
  ],
  "technologies": [
    "React",
    "Context API",
    "React Router",
    "Node.js",
    "Tailwind CSS",
    "Framer Motion",
    "Vite"
  ],
  "limitations": "No utiliza Express ni MongoDB en el código revisado. La persistencia depende de la variante ejecutada; el backend desplegado, sus sesiones y la conservación de datos en producción no se han verificado.",
  "limitationTitle": "Persistencia de demostración",
  "image": "/taskflowleo.png",
  "imageAlt": "Tablero TaskFlow con columnas Backlog, En progreso, Review y Done, y un resumen de tareas con datos de muestra.",
  "demo": "https://taskleodemo.vercel.app/",
  "github": "https://github.com/LeoFerreiro/taskflow",
  "layout": "split",
  "category": "demos",
  "status": "prototype",
  "imageWidth": 1907,
  "imageHeight": 945,
  "imageDefault": "/projects/taskflow-1600.webp",
  "imageSources": "/projects/taskflow-960.webp 960w, /projects/taskflow-1600.webp 1600w",
  "evidence": {
    "level": "source-reviewed",
    "revision": "a28705c387dcdb96ffb04e086c2bd77479f8cc8e",
    "files": [
      "src/components/Sidebar.jsx",
      "src/components/KanbanBoard.jsx",
      "src/services/taskService.js",
      "server/index.js",
      "api/_lib/store.js",
      "package.json"
    ],
    "liveDemoVerified": false
  }
},
  {
  "id": "business-landing",
  "title": "Atlas Contable",
  "description": "Una landing de demostración para un estudio contable, con navegación por servicios, recursos y un formulario simulado.",
  "purpose": "Presentar una estructura de sitio para explicar servicios y facilitar una consulta, sin representar un encargo o cliente real.",
  "features": [
    "Navegación por secciones y menú móvil.",
    "Selección visual de servicios y etapas del enfoque.",
    "Diálogo de caso ilustrativo y validación local de campos del formulario."
  ],
  "decisions": [
    {
      "title": "Una página estática",
      "text": "HTML, CSS y JavaScript organizan la página sin React ni un framework de componentes. Un script Node prepara los archivos para servirlos."
    },
    {
      "title": "Interacciones por eventos",
      "text": "Los controles actualizan clases y abren un diálogo nativo. El formulario muestra una confirmación local, sin enviar una consulta a un servicio."
    }
  ],
  "technologies": [
    "HTML",
    "CSS",
    "JavaScript",
    "Node.js · build estático"
  ],
  "limitations": "El formulario no envía mensajes. Las cifras y el caso ilustrativo de la demo son contenido de muestra: no acreditan clientes ni resultados comerciales de Leonardo.",
  "limitationTitle": "Contenido ilustrativo",
  "image": "/blpleo.png",
  "imageAlt": "Inicio de Atlas Contable con presentación de servicios contables y una imagen de escritorio; las cifras visibles son contenido de muestra de la demo.",
  "demo": "https://blp-leo.vercel.app/",
  "github": "https://github.com/LeoFerreiro/blp-leo",
  "layout": "split-reverse",
  "category": "demos",
  "status": "prototype",
  "imageWidth": 1906,
  "imageHeight": 947,
  "imageDefault": "/projects/atlas-contable-1600.webp",
  "imageSources": "/projects/atlas-contable-960.webp 960w, /projects/atlas-contable-1600.webp 1600w",
  "evidence": {
    "level": "source-reviewed",
    "revision": "7996717f1da46ab2ef6dd8dd8d3711f8e5ea1690",
    "files": [
      "index.html",
      "src/app.js",
      "src/styles.css",
      "build.mjs",
      "package.json"
    ],
    "liveDemoVerified": false
  }
},
  {
  "id": "nocheviva",
  "title": "NocheViva",
  "description": "Una ticketera de demostración para recorrer una cola simulada, elegir entradas y completar una compra ficticia.",
  "purpose": "Explorar los estados de un recorrido de compra de entradas, desde la selección de un evento hasta la consulta de tickets de muestra.",
  "features": [
    "Catálogo de eventos con búsqueda y filtros.",
    "Cola simulada por temporizador y selección de entradas.",
    "Registro local, checkout ficticio, Mis tickets y presentación del arrepentimiento de compra."
  ],
  "decisions": [
    {
      "title": "Estado efímero y explícito",
      "text": "Usuario, carrito y tickets se mantienen en un objeto de estado en memoria. Recargar la página reinicia la demo, sin base de datos ni persistencia."
    },
    {
      "title": "Un recorrido simulado",
      "text": "El progreso de cola se genera con un temporizador. La compra produce tickets de muestra y el arrepentimiento presenta un flujo informativo; no reserva entradas ni procesa devoluciones."
    }
  ],
  "technologies": [
    "HTML",
    "CSS",
    "JavaScript"
  ],
  "limitations": "No hay cola real, cobros, reservas de entradas ni devoluciones procesadas. El registro no crea una cuenta real y los datos se pierden al recargar. Las fechas, precios y disponibilidad son de demostración.",
  "limitationTitle": "Sin transacciones reales",
  "image": "/buyticket.png",
  "imageAlt": "Inicio de NocheViva con evento destacado, pasos de cola y compra demo; precios y disponibilidad pertenecen a una simulación.",
  "demo": "https://buytecket-leo.vercel.app/",
  "github": "https://github.com/LeoFerreiro/buyticket-leo",
  "layout": "wide",
  "category": "demos",
  "status": "prototype",
  "imageWidth": 1893,
  "imageHeight": 943,
  "imageDefault": "/projects/nocheviva-1600.webp",
  "imageSources": "/projects/nocheviva-960.webp 960w, /projects/nocheviva-1600.webp 1600w",
  "evidence": {
    "level": "source-reviewed",
    "revision": "e7d6251484bf0fdee3bf3d0d0df68b20378b8725",
    "files": [
      "index.html",
      "src/app.js",
      "src/state/store.js",
      "src/ui/render.js",
      "package.json"
    ],
    "liveDemoVerified": false
  }
},
];
