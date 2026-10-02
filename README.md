# CC5002 - Tarea 2: Avistamiento de Aves
Nombre: Fabián Andrés Ormeño Araya

Prototipo de aplicación web para el registro de avistamiento de aves. Esta tarea se probó a través de Google Chrome y Microsoft Edge.

## Archivos
```
proyecto/
├── database/
│   ├── aves.sql
│   ├── db.py
│   ├── region-comuna.sql
│   └── tarea2.sql
├── static/
│   ├── css/
│   │   ├── form.css
│   │   └── main.css
│   ├── js/
│   │   ├── main.js
│   │   ├── register.js
│   │   ├── select.js
│   │   └── sighting.js
│   └── uploads/
├── templates/
│   ├── base.html
│   ├── data.html
│   ├── home.html
│   ├── register.html
│   ├── registered.html
│   ├── sighting-detail.html
│   └── sighting.html
├── utils/
│   └── validation.py
├── app.py
├── README.md
└── requirements.txt
```

## Requisitos
Para ejecutar el proyecto se necesita:

Python 3. (en especifo se utilizó Python 3.14.7)

MySQL.

Las dependencias indicadas en requirements.txt.

Una base de datos configurada con las credenciales indicadas en el enunciado de la tarea.
## Ejecución

Para ejecutar el prototipo, usted debe
- Crear un ambiente con:
```
python -m venv venv
```
- Iniciar el ambiente con:
```
.\venv\Scripts\activate
```
- Instalar las dependencias con:
```
pip install -r requirements.txt
```
- Iniciar el esquema y las tablas utilizando tarea2.sql
- Poblar la tabla de las aves utilizando aves.sql
- Poblar las tablas de región y comunas utilizando region-comuna.sql
(Estos tres pasos los realicé con las extensiones de Database)
- Iniciar la página web con:
```
python app.py
```

## Direcciones principales
http://127.0.0.1:5000/ : página de inicio
http://127.0.0.1:5000/register : página de registro de voluntario
http://127.0.0.1:5000/sighting : página de registro de avistamiento
http://127.0.0.1:5000/data : página de revisión de observación de información

## Funcionalidades

A través del prototipo se puede:

- Registrarse como persona voluntaria.
- Registrar avistamientos de aves.
- Consultar y filtrar los avistamientos por tipo de ave. El filtro muestra las aves cuya especie contenga el texto ingresado.
- Ordenar los avistamientos por fecha, desde el más reciente al más antiguo, o por comuna, en orden alfabético.
- Revisar los resultados a través de la paginación, en la que se muestran 2 avistamientos por página.
- Visualizar indicadores y métricas mediante gráficos.

## Decisiones y consideraciones para la corrección

- Los campos obligatorios se identifican visualmente mediante un asterisco (*).
- Las validaciones de los formularios se realizan mediante JavaScript y luego con Flask.
- La fecha del avistamiento se valida para evitar que corresponda a una fecha futura o una fecha anterior al 2000.
- Para registrar un avistamiento se exige adjuntar al menos una fotografía o vídeo.
- El filtro de avistamientos permite buscar coincidencias dentro del tipo de ave ingresado.
- Para los archivos CSS, HTML, JavaScript y Python utilicé como base el código entregado por el auxiliar. 
- Se separó el formulario de crear un avistamiento del listado y se modificó el listado de avistamientos para aplicar el feedback dado de la tarea 1.
- Al final de la página de /data se dejó el apartado relacionado a las estadísticas (indicadores y métricas) sin funcionalidad.
- Se modificó la estructura de tarea2.sql para agregar un campo de contraseña a la tabla de voluntario y una referencia a comuna en la tabla de avistamiento, para adaptarse a los formularios creados durante la tarea 1.
- Los archivos subidos por los formularios se almacenan en static/uploads/
- Para validar los HTML se utilizó la página https://validator.w3.org/nu/#textarea al copiar dichos HTML desde la fuente con las herramientas para desarrolladores de Chrome, y los CSS con http://jigsaw.w3.org/css-validator/.