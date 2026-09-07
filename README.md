# CC5002 - Tarea 1: Avistamiento de Aves
Nombre: Fabián Andrés Ormeño Araya

Prototipo de aplicación web para el registro de avistamiento de aves. Esta tarea se probó a través de Google Chrome y Microsoft Edge.

## Archivos

proyecto/
├── css/
│   ├── main.css
│   └── register.css
├── html/
│   ├── main.html
│   └── register.html
├── img/
│   ├── ganso.jpeg
│   └── pato.jpeg
├── js/
│   ├── main.js
│   ├── register.js
│   └── select.js
└── README.md

## Ejecución

Para ejecutar el prototipo, se debe abrir el archivo register.html, en el que se simulará el registro de un usuario y ser redirigido a main.html.

## Funcionalidades

A través del prototipo se puede:

- Registrarse como persona voluntaria.
- Registrar avistamientos de aves.
- Consultar y filtrar los avistamientos por tipo de ave. El filtro muestra las aves cuyo tipo contenga el texto ingresado.
- Ordenar los avistamientos por fecha, desde el más reciente al más antiguo, o por lugar, en orden alfabético.
- Revisar los resultados a través de la paginación, en la que se muestran 2 post por página.
- Visualizar indicadores y métricas mediante gráficos.

## Decisiones y consideraciones para la corrección

- Los campos obligatorios se identifican visualmente mediante un asterisco (*).
- Las validaciones de los formularios se realizan mediante JavaScript.
- La fecha del avistamiento se valida para evitar que corresponda a una fecha futura o una fecha anterior al 2000.
- Para registrar un avistamiento se exige adjuntar al menos una fotografía o vídeo.
- El filtro de avistamientos permite buscar coincidencias dentro del tipo de ave ingresado.
- Para los archivos CSS, HTML y JavaScript utilicé como base el código entregado por el auxiliar. 
- Las imagenes ganso.jpeg y pato.jpeg son fotos que saqué con mi celular.