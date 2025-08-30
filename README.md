# tpfinalSprint5

## 1. Resumen
Proyecto final del sprint 5: API y UI para gestionar países usando datos transformados desde restcountries.com, con persistencia en MongoDB y vistas EJS.

## 2. Documentación (README)

- Objetivos
	- Proveer un CRUD completo para recursos `Country` (lista, crear, editar, eliminar).
	- Alinear el modelo Mongoose con la estructura transformada por la utilidad de importación (`bajarDatosapi.mjs`), preservando campos `tipoDato` y `creador` cuando aplique.
	- UI con DataTables para listados y un único formulario EJS para crear/editar.
	- Validación en backend (express-validator y validaciones adicionales en controladores). No hay validación en el front que bloquee el envío.

- Tecnologías usadas
	- Node.js (ES Modules)
	- Express
	- EJS (vistas)
	- Mongoose (MongoDB)
	- express-validator
	- DataTables (cliente)
	- Bootstrap, Font Awesome (estilos / iconos)

- Pasos de ejecución
	1. Instalar dependencias:

		 ```powershell
		 npm install
		 ```

	2. Variables de entorno (opcional):
		 - Si usás una URI de MongoDB distinta a la incluida en `src/config/dbConfig.mjs`, exportala en la variable `MONGODB_URI`. El proyecto actualmente usa la cadena definida en `dbConfig.mjs`, pero se recomienda parametrizarla en producción.

		 Ejemplo (PowerShell):

		 ```powershell
		 $env:MONGODB_URI = 'mongodb+srv://usuario:clave@cluster.mongodb.net/mi-base'
		 ```

	3. Importar datos desde la API pública (opcional):
		 - Para ejecutar la utilidad `bajarDatosapi.mjs` y cargar datos desde restcountries, ejecutar:

		 ```powershell
		 node src/util/bajarDatosapi.mjs --import-data
		 ```

	4. Iniciar la aplicación:

		 ```powershell
		 node app.mjs
		 ```

	5. Abrir el navegador en `http://localhost:3000/countries` (según el puerto configurado en `app.mjs`).

- Consideraciones especiales (variables de entorno, etc.)
	- `MONGODB_URI` (recomendado): si se configura, debería usarse en `src/config/dbConfig.mjs` para no tener credenciales fijas en el repositorio.
	- `--import-data`: al ejecutar `node src/util/bajarDatosapi.mjs --import-data` la utilidad conectará a la DB, solicitará datos a `restcountries.com` y hará `insertMany` en la colección `countries`.
	- Importante: `bajarDatosapi.mjs` fue modificado para NO ejecutarse automáticamente al requerir el módulo; se ejecuta solo con la bandera `--import-data`.
	- Manejo de formatos en formularios: campos multi-valor (capital, borders, timezones) aceptan texto separado por comas en el formulario y se parsean en el servidor; `languages` y `gini` aceptan formato línea a línea `clave:valor`.
	- Validación: toda la validación ocurre en el servidor. Errores se muestran inline en la vista `formCountry.ejs`.

## 3. Notas de desarrollo
- Scripts útiles
	- `node --check app.mjs` — comprobar sintaxis sin ejecutar el servidor.
	- `node app.mjs` — iniciar servidor (por defecto puerto 3000 si no se cambió).

- Recomendaciones
	- Parametrizar la conexión a MongoDB usando `MONGODB_URI` en `src/config/dbConfig.mjs`.
	- Evitar hardcodear credenciales en el repositorio.

## 4. Contacto
Para dudas o pruebas adicionales, correr el servidor en local y abrir las rutas de la aplicación. Si necesitás que haga una prueba en la sesión actual (iniciar servidor y simular un envío), decime y lo hago.

---

Documento generado automáticamente por los cambios realizados en el sprint (instrucciones de uso y consideraciones). Si querés que agregue ejemplos de peticiones API (curl / Postman) o un diagrama de flujo, lo puedo añadir.
# tpfinalSprint5