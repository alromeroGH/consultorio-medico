
Consultorio Medicina 🩺
Este proyecto fue generado con Angular CLI versión 16.2.12.

📝 Descripción del Proyecto
Sistema web para la gestión de la agenda y turnos de un consultorio privado de medicina. La aplicación está diseñada para manejar diferentes tipos de usuarios con funcionalidades específicas, permitiendo una mejor organización en el manejo de pacientes.

El desarrollo está basado en Angular 16 utilizando Angular Material para el diseño y los estilos.

👥 Roles y Funcionalidades Principales
El sistema está diseñado para manejar cuatro tipos de usuarios : Administrador , Operador , Médico y Paciente.





1. Paciente

Nuevo Turno: Acceso a un formulario para seleccionar especialidad, profesional, fecha y hora. Requiere un campo de notas obligatorio para indicar el motivo del turno. La cobertura se muestra precargada y no es editable.



Mis Turnos: Visualización de turnos asignados, ordenados del más próximo al menos próximo. Al hacer clic, se despliega la información detallada (fecha, hora, especialista, especialidad).



Mis Datos Personales: Permite ver la información personal, con la posibilidad de modificar el correo electrónico, contraseña, teléfono y cobertura.

2. Médico

Turnos Programados: Por defecto, se muestran los turnos del día actual. Permite seleccionar otra fecha usando un date picker para ver los turnos programados. La tabla muestra hora, nombre, apellido y edad del paciente. Al hacer clic en la fila, se despliegan las notas del turno.




Gestión de Agenda: Pantalla para dar de alta días y rangos horarios disponibles. Permite agregar múltiples rangos horarios por día.


3. Administrador

Gestión de Usuarios: Lista de todos los usuarios, con capacidad de filtrar por nombre, apellido y tipo de usuario. Puede crear usuarios de tipo Operador, Médico y Administrador y editar cualquier campo de cualquier tipo de usuario.




Gestión de Coberturas: Funcionalidades para Crear, Modificar y Eliminar coberturas. No permite eliminar una cobertura si está asociada a algún usuario.



Gestión de Especialidades: Funcionalidades para Crear, Modificar y Eliminar especialidades. No permite eliminar una especialidad si está asociada a algún médico.


4. Operador
Puede crear nuevos pacientes.

Puede asignar turnos y ver/modificar la agenda de cualquier médico.

Visualiza una tabla con la lista de médicos que tienen turnos habilitados para la fecha seleccionada.

🚀 Servidor de Desarrollo
Ejecuta ng serve para iniciar el servidor de desarrollo. Navega a http://localhost:4200/. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

🛠️ Generación de Código (Scaffolding)
Ejecuta ng generate component nombre-del-componente para generar un nuevo componente. También puedes usar ng generate directive|pipe|service|class|guard|interface|enum|module.

🏗️ Construcción
Ejecuta ng build para construir el proyecto. Los artefactos de construcción se almacenarán en el directorio dist/.

🧪 Ejecución de Pruebas Unitarias
Ejecuta ng test para ejecutar las pruebas unitarias a través de Karma.

🔍 Ejecución de Pruebas End-to-End
Ejecuta ng e2e para ejecutar las pruebas end-to-end a través de la plataforma de tu elección. Para usar este comando, primero necesitas añadir un paquete que implemente las capacidades de prueba end-to-end.

📚 Ayuda Adicional
Para obtener más ayuda sobre Angular CLI, usa ng help o visita la página Angular CLI Overview and Command Reference.
