// checkRoutes.js
const fs = require('fs');
const path = require('path');

// Apunta a src/app, que es donde está nuestro directorio de rutas.
const appDir = path.join(__dirname, 'src', 'app'); 
const validPages = [];
const missingPages = [];

function checkPages(dir, route = '') {
  // Asegurarse de que el directorio existe antes de leerlo
  if (!fs.existsSync(dir)) {
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  let hasPageFile = false;
  let isRouteGroup = path.basename(dir).startsWith('(') && path.basename(dir).endsWith(')');

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    // Ignorar los route groups en la ruta final
    const newRouteSegment = isRouteGroup ? route : path.join(route, entry.name);

    if (entry.isDirectory()) {
      // revisa si tiene page.tsx o page.jsx
      const pageTsx = fs.existsSync(path.join(fullPath, 'page.tsx'));
      const pageJsx = fs.existsSync(path.join(fullPath, 'page.jsx'));
      
      const routePath = newRouteSegment.replace(/\\/g, '/');

      if (pageTsx || pageJsx) {
        // Normalizamos la ruta para que empiece con '/'
        const finalRoute = routePath.startsWith('/') ? routePath : `/${routePath}`;
        if (!validPages.includes(finalRoute)) {
            validPages.push(finalRoute);
        }
        hasPageFile = true;
      }

      // sigue buscando recursivamente
      checkPages(fullPath, routePath);
    }
  });

  // Si una carpeta tiene subdirectorios pero ninguno resulta en una página, se considera sin page.
  if (entries.some(e => e.isDirectory()) && !hasPageFile && route) {
     const routePath = route.replace(/\\/g, '/');
     if (!missingPages.includes(routePath)) {
        missingPages.push(routePath);
     }
  }
}

// Ejecuta el chequeo
checkPages(appDir, '/');

// Reporte final
console.log('=========================');
console.log('✅ Rutas válidas encontradas:');
validPages.sort().forEach(r => console.log(r));

console.log('\n⚠️ Carpetas sin page.tsx / page.jsx (posibles rutas faltantes):');
missingPages.sort().forEach(r => console.log(r));

console.log('\nResumen:');
console.log(`Total rutas válidas: ${validPages.length}`);
console.log(`Total carpetas sin page: ${missingPages.length}`);
console.log('=========================');
