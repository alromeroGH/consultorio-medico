# 🩺 Consultorio Medicina

Este proyecto fue generado con **Angular CLI** versión `16.2.12`.

---

## 📝 Descripción del Proyecto

Sistema web para la **gestión de la agenda y turnos de un consultorio privado de medicina**.  
La aplicación está diseñada para manejar diferentes tipos de usuarios con funcionalidades específicas, permitiendo una mejor organización en el manejo de pacientes.

El desarrollo está basado en **Angular 16**, utilizando **Angular Material** para el diseño y los estilos.

---

## 👥 Roles y Funcionalidades Principales

El sistema está diseñado para manejar **cuatro tipos de usuarios**:

- 🧑‍💼 **Administrador**  
- 🧑‍💻 **Operador**  
- 🧑‍⚕️ **Médico**  
- 👤 **Paciente**

---

### 1. 👤 Paciente

- **Nuevo Turno:**  
  Acceso a un formulario para seleccionar especialidad, profesional, fecha y hora.  
  Requiere un campo de notas obligatorio para indicar el motivo del turno.  
  La cobertura se muestra precargada y no es editable.

- **Mis Turnos:**  
  Visualización de turnos asignados, ordenados del más próximo al menos próximo.  
  Al hacer clic, se despliega la información detallada (fecha, hora, especialista, especialidad).

- **Mis Datos Personales:**  
  Permite ver la información personal, con la posibilidad de modificar:
  - Correo electrónico  
  - Contraseña  
  - Teléfono  
  - Cobertura

---

### 2. 🧑‍⚕️ Médico

- **Turnos Programados:**  
  Por defecto, se muestran los turnos del día actual.  
  Permite seleccionar otra fecha usando un **date picker** para ver los turnos programados.  
  La tabla muestra hora, nombre, apellido y edad del paciente.  
  Al hacer clic en la fila, se despliegan las notas del turno.

- **Gestión de Agenda:**  
  Pantalla para dar de alta días y rangos horarios disponibles.  
  Permite agregar múltiples rangos horarios por día.

---

### 3. 🧑‍💼 Administrador

- **Gestión de Usuarios:**  
  Lista de todos los usuarios, con capacidad de filtrar por nombre, apellido y tipo de usuario.  
  Puede crear usuarios de tipo **Operador**, **Médico** y **Administrador**, y editar cualquier campo de cualquier tipo de usuario.

- **Gestión de Coberturas:**  
  Funcionalidades para **crear**, **modificar** y **eliminar** coberturas.  
  No permite eliminar una cobertura si está asociada a algún usuario.

- **Gestión de Especialidades:**  
  Funcionalidades para **crear**, **modificar** y **eliminar** especialidades.  
  No permite eliminar una especialidad si está asociada a algún médico.

---

### 4. 🧑‍💻 Operador

- Puede crear nuevos pacientes.  
- Puede asignar turnos y ver/modificar la agenda de cualquier médico.  
- Visualiza una tabla con la lista de médicos que tienen turnos habilitados para la fecha seleccionada.

---

## ⚙️ Instalación y Requisitos Previos

Antes de comenzar, asegurate de tener instalado:

- [Node.js](https://nodejs.org/) (versión recomendada: LTS)
- [Angular CLI](https://angular.io/cli)
- Un navegador moderno (por ejemplo, Chrome, Edge o Firefox)

Para instalar Angular CLI si no lo tenés:

```bash
npm install -g @angular/cli
