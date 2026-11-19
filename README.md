# CC5002 - Tarea 4: Avistamiento de Aves
Nombre: Fabián Andrés Ormeño Araya

Prototipo de aplicación web para el registro de avistamiento de aves. Esta tarea se probó a través de Google Chrome y Microsoft Edge.

## Archivos

Los archivos marcados con un * fueron los modificados/agregados para la tarea 4
```
proyecto/
├── tarea1-2-3/
│   ├── database/
│   │   ├── aves.sql
│   │   ├── db.py*
│   │   ├── region-comuna.sql
│   │   └── tarea2.sql
│   ├── static/
│   │   ├── css/
│   │   │   ├── form.css
│   │   │   ├── graph.css
│   │   │   └── main.css
│   │   ├── js/
│   │   │   ├── comment.js
│   │   │   ├── graph.js
│   │   │   ├── register.js
│   │   │   ├── select.js
│   │   │   ├── sighting.js
│   │   │   └── table.js*
│   │   ├── uploads/
│   │   ├── bootstrap.min.js
│   │   ├── jquery-3.5.1.min.js
│   │   ├── jquery.flot.categories.js
│   │   ├── jquery.flot.js
│   │   ├── jquery.flot.navigate.js
│   │   ├── jquery.flot.pie.js
│   │   └── jquery.flot.time.js
│   ├── templates/
│   │   ├── base.html
│   │   ├── data.html*
│   │   ├── home.html*
│   │   ├── register.html
│   │   ├── registered.html
│   │   ├── sighting-detail.html*
│   │   └── sighting.html
│   ├── utils/
│   │   └── validation.py*
│   ├── app.py*
│   └── requirements.txt
├── tarea4/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/tarea4/tarea4/
│   │       │   ├── controllers/
│   │       │   │   ├── ApiController.java*
│   │       │   │   └── AppController.java*
│   │       │   ├── models/
│   │       │   │   ├── Ave.java*
│   │       │   │   ├── Avistamiento.java*
│   │       │   │   ├── AvistamientoRepository.java*
│   │       │   │   ├── Comuna.java*
│   │       │   │   ├── Nota.java*
│   │       │   │   ├── NotaRepository.java*
│   │       │   │   └── Voluntario.java*
│   │       │   ├── services/
│   │       │   │   ├── ApiService.java*
│   │       │   │   └── AppService.java*
│   │       │   └── Tarea4Application.java*
│   │       └── resources/
│   │           ├── static/
│   │           │   ├── css/
│   │           │   │   └── main.css*
│   │           │   └── js/
│   │           │       └── filter.js*
│   │           └── templates/
│   │               ├── fragments/
│   │               │   └── sighting_box.html*
│   │               └── data.html*
│   └── tabla-nota.sql
└── README.md
```
## Requisitos
Para ejecutar el proyecto se necesita:

Python 3. (en específico se utilizó Python 3.14.7)

JDK 27

MySQL.

Las dependencias indicadas en requirements.txt.

Una base de datos configurada con las credenciales indicadas en el enunciado de la tarea.

Crear /static/uploads si es que no está definida.
## Ejecución

Para ejecutar el prototipo, usted debe
* Desde la carpeta tarea1-2-3/
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
(Estos tres pasos los realicé con la extensión de Database Client de MySQL)
- Iniciar la página web con:
```
python app.py
```

* Desde la carpeta tarea4/
- Crear la tabla de notas con tabla-nota.sql
- Iniciar la página de evaluación de notas con:
```
.\mvnw.cmd spring-boot:run
```

- Flask se ejecuta en el puerto 5000.
- Spring Boot se ejecuta en el puerto 8080.
- Para disponer de todas las funcionalidades se necesita ejecutar las dos aplicaciones a la vez.

## Direcciones principales
http://127.0.0.1:5000/ : página de inicio
http://127.0.0.1:5000/register : página de registro de voluntario
http://127.0.0.1:5000/sighting : página de registro de avistamiento
http://127.0.0.1:5000/data : página de revisión de observación de información
http://127.0.0.1:8080/ : página de evaluación

## Funcionalidades

A través del prototipo se puede:

- Registrarse como persona voluntaria.
- Registrar avistamientos de aves.
- Consultar y filtrar los avistamientos por tipo de ave. El filtro muestra las aves cuya especie contenga el texto ingresado.
- Ordenar los avistamientos por fecha, desde el más reciente al más antiguo, o por comuna, en orden alfabético.
- Revisar los resultados a través de la paginación, en la que se muestran 2 avistamientos por página.
- Visualizar indicadores y métricas mediante gráficos.
- Dejar un comentario en un avistamiento registrado.
- Revisar en una tabla detalles de los avistamientos registrados, que permite filtrar a través de texto.
- Evaluar un avistamiento registrado.

## Decisiones y consideraciones para la corrección

### Para Tarea 1-2-3
- Los campos obligatorios se identifican visualmente mediante un asterisco (*).
- Las validaciones de los formularios se realizan mediante JavaScript y luego con Flask.
- La fecha del avistamiento se valida para evitar que corresponda a una fecha futura o una fecha anterior al 2000.
- Para registrar un avistamiento se exige adjuntar al menos una fotografía o vídeo.
- El filtro de avistamientos permite buscar coincidencias dentro del tipo de ave ingresado.
- Para los archivos CSS, HTML, JavaScript y Python utilicé como base el código entregado por el auxiliar. 
- Se separó el formulario de crear un avistamiento del listado y se modificó el listado de avistamientos para aplicar el feedback dado de la tarea 1.
- Los gráficos vistos en la página /data fueron realizados a través de Flot https://www.flotcharts.org/.
- Para las llamadas asíncronas se decidió utilizar el método de fetch.
- Se modificó la estructura de tarea2.sql para agregar un campo de contraseña a la tabla de voluntario y una referencia a comuna en la tabla de avistamiento, para adaptarse a los formularios creados durante la tarea 1.
- Los archivos subidos por los formularios se almacenan en static/uploads/
- Para validar los HTML se utilizó la página https://validator.w3.org/nu/#textarea al copiar dichos HTML desde la fuente con las herramientas para desarrolladores de Chrome, y los CSS con http://jigsaw.w3.org/css-validator/.

### Feedback tarea 2
- Ahora no se puede registrar un voluntario si ya existe uno con el mismo nombre de usuario o con el mismo correo.
- Se arregló la validación de la fecha al tomar en cuenta la zona horaria.
- Para evitar que archivos diferentes con el mismo nombre se sobrescriban, se genera un nombre mediante un hash SHA-256, utilizando el nombre original del archivo, la fecha del avistamiento y un número aleatorio.
- Se puede abrir el detalle de un avistamiento al hacer click en la fila.
- Se agregó soporte de archivos .mov en el detalle del avistamiento.

### Tarea 4
- Se añadió a la página de inicio un botón para redireccionar a la página de evaluación.
- Para las llamadas asíncronas se decidió utilizar el método de fetch.
- Al filtrar por texto se compara con el nombre del ave, con el nombre del voluntario, con la comuna del avistamiento y con la fecha.
- Al evaluar un avistamiento solo se le puede dar una nota "entera" (1, 2, 3, 4, 5, 6 o 7)
- El promedio de las notas se aproxima a un decimal.
- Para validar los HTML se utilizó la página https://validator.w3.org/nu/#textarea al copiar dichos HTML desde la fuente con las herramientas para desarrolladores de Chrome, y los CSS con http://jigsaw.w3.org/css-validator/.
- En la parte del arból de archivos de la tarea 4 solo se indicó los archivos modificados.
