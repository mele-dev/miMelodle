# Historias de Usuario - Melodle

## Notas generales
- La funcionalidad general del sitio tiene que ser accesible a personas con
  discapacidad visual.
- En el documento usamos checkboxes:
  - [ ] -> unchecked
  - [~] -> unchecked, opcional.
  - [x] -> checked.
  - [nombre] -> `nombre` está trabajando en esto.
    Ej: [cristian], [juana], [juan], [cristian & juana].


## 1. Registro de nuevo usuario

# Historia de Usuario - Registro de nuevo usuario en Melodle

## Descripción
Como nuevo usuario, quiero poder registrarme en Melodle para poder hacer uso de sus funcionalidades.

## Criterios de aceptación [ ]
- [ ] Debe existir un botón para registrarse en la pantalla de login.
- [ ] La pantalla de registro debe permitir crear la cuenta mediante:
  - [ ] Correo electrónico y contraseña
  - [ ] Autenticación por Spotify
- [ ] Se debe solicitar un nombre de usuario que puede ser repetido.
- [ ] Se debe asignar una ID expuesta que diferencie al usuario de otros con el mismo nombre.
- [ ] El sistema debe validar que el correo electrónico tenga un formato válido.
- [ ] El sistema debe validar que la contraseña cumpla con requisitos mínimos de seguridad.
- [ ] El sistema debe validar que el correo electrónico no esté en uso.
- [ ]
- [ ] Se deben mostrar mensajes de error claros en caso de datos inválidos o problemas en el registro.
- [~]  Permitir al usuario seleccionar una foto de perfil de su galería.

## Prioridad
Alta

## Estimación
5 puntos

## Definition of Ready [ ]
- [ ] El diseño de la interfaz de usuario para el registro está aprobado.
- [ ] Los requisitos de seguridad para contraseñas están definidos.
- [ ] La integración con la autenticación de Spotify está configurada.
- [ ] Las pruebas de accesibilidad están definidas.

## Definition of Done [ ]
- [ ] Todos los criterios de aceptación han sido implementados y probados.
- [ ] La funcionalidad ha sido probada en todos los dispositivos compatibles.
- [ ] Se ha verificado la accesibilidad del flujo para personas con discapacidad visual.
- [ ] El código ha pasado la revisión de pares.
- [ ] La documentación del usuario ha sido actualizada.
- [ ] Las pruebas de integración y unitarias están implementadas y pasando.

## Notas adicionales
- La funcionalidad general del sitio, incluyendo este flujo de registro, debe ser accesible a personas con discapacidad visual.

## 2. Elección de inicio de sesión

### Descripción
Como usuario, quiero poder elegir la manera en la que inicio sesión para sincronizar la aplicación con mi cuenta de Spotify o no.

### Criterios de aceptación
- Debe existir un botón para iniciar sesión con Spotify.
- Ese botón debe poder vincular a la cuenta de Spotify si la cuenta de Melodle fue previamente registrada.
- Debe haber un botón para iniciar sesión con nombre de usuario y contraseña, sin necesidad de una cuenta de Spotify.

### Prioridad
Alta

### Estimación
13 puntos

### Notas adicionales
- El uso debe ser accesible.

### Definition of Ready
- Puedo ingresar a mi cuenta sin problemas.
- Se carga mi información actualizada en la plataforma (artistas, amigos, etc)

### Definition of Done
- La funcionalidad ha sido aprobada en todos los dispositivos compatibles.
- Se ha verificado la accesibilidad del flujo.

---

## 3. Jugar Wordle diario

### Descripción
Como usuario de Melodle, quiero poder jugar un Wordle por dia, para competir con mis amigos.

### Criterios de aceptación
- El usuario debe haber seleccionado los artistas que desea en su pantalla, o cargados desde su cuenta de Spotify.
- Debe existir un botón con la opción de jugar Wordle.
- El usuario no debe haber jugado el Wordle de ese artista ese día.
- Debe existir la posibilidad de agregar amigos.

### Prioridad
Alta

### Estimación
8 puntos

### Notas adicionales
- El uso debe ser accesible.

### Definition of Ready
- El usuario puede disfrutar de un juego diario por artista sin problemas.
- Se notifica y 'bloquea' el juego una vez finalizado.

### Definition of Done
- La funcionalidad ha sido aprobada en todos los dispositivos compatibles.
- Se ha verificado la accesibilidad del flujo.

---

## 4. Wordle

### Descripción
Como usuario de Melodle, quiero poder jugar Wordle con la opción de adivinar una canción o un verso de una canción, para elegir la manera en que más me divierto.

### Criterios de aceptación
- Debe existir un botón para cambiar de modo.
- Deben existir bloques vacíos para completar con letras del nombre de la canción, o con letras del verso.
- En la opción de adivinar canción, deben mostrarse en pantalla 3 pistas sobre la canción (ej. versos).
- En la opción de adivinar verso, se muestra en pantalla el nombre de la canción.
- Las canciones en ambos modos deben ser diferentes.
- El usuario tiene 5 intentos para adivinar.
- Se deben mostrar las letras adivinadas, adivinadas en la posición correcta, y descartar las incorrectas.
- Debe existir la posibilidad de pausar el juego y volver a la pantalla anterior.
- Tras completar los 5 intentos, se debe bloquear la pantalla, ya sea que se gane o se pierda.
- El usuario solo puede jugar un Wordle por artista al día.

### Prioridad
Alta

### Estimación
13 puntos

### Notas adicionales
- Las letras que usuario ingresar que esten en el lugar correcto quedaran colocadas en bloque y el color del mismo cambiará a verde.
- Las letras ingresadas que sean correctas pero que esten mal posicionadas se mostrarán a un costado en color amarillo.
- Las incorrectas lo mismo pero en color gris.

### Definition of Ready
- El usuario puede disfrutar de un juego diario por artista sin problemas.
- Se notifica y 'bloquea' el juego una vez finalizado.

### Definition of Done
- La funcionalidad ha sido aprobada en todos los dispositivos compatibles.
- Se ha verificado la accesibilidad del flujo.

---

## 5. Página de inicio

### Descripción
Como usuario de Melodle, quiero ver en mi página de inicio una lista de mis artistas favoritos con información relevante sobre ellos, para mantenerme al tanto de sus novedades.

### Criterios de aceptación
- Debe existir un botón para añadir nuevos artistas a la página.
- Cada artista debe mostrarse con su nombre, imagen, proyectos futuros (giras, álbumes, canciones) y un botón para jugar al Wordle.

### Prioridad
Alta

### Estimación
5 puntos

### Notas adicionales
- La funcionalidad debe ser accesible.

### Definition of Ready
- El usuario puede agregar artistas y ver un listado con su información.

### Definition of Done
- La funcionalidad y diseño han sido aprobados en todos los dispositivos compatibles.
- La accesibilidad del flujo ha sido verificada.

---

## 6. Agregar amigos

### Descripción
Como usuario de Melodle, quiero poder agregar amigos para competir en el Wordle y comparar nuestras puntuaciones.

### Criterios de aceptación
- Debe existir un botón para añadir amigos por nombre de usuario.
- Debe haber una sección que muestre una lista de amigos agregados manualmente o sincronizados desde Spotify.
- Debe existir un leaderboard donde se muestren las puntuaciones de los amigos.

### Prioridad
Media

### Estimación
8 puntos

### Notas adicionales
- La funcionalidad debe ser accesible.

### Definition of Ready
- El usuario puede agregar amigos fácilmente.
- Se muestra un listado de amigos.
- El usuario puede acceder a los perfiles de sus amigos.

### Definition of Done
- La funcionalidad y diseño han sido aprobados en todos los dispositivos compatibles.
- La accesibilidad del flujo ha sido verificada.

---

## 7. Leaderboard

### Descripción
Como usuario de Melodle, quiero ver una tabla de clasificación que muestre las puntuaciones de mis amigos y la mía para poder competir.

### Criterios de aceptación
- Debe existir una sección de Leaderboard.
- La tabla debe mostrar, en orden descendente, las puntuaciones de los amigos, incluyendo la del usuario.
- La tabla debe actualizarse automáticamente tras cada partida de Wordle.

### Prioridad
Media

### Estimación
5 puntos

### Notas adicionales
- La funcionalidad debe ser accesible.

### Definition of Ready
- El usuario puede visualizar el leaderboard.
- Se muestra una lista con las mejores y peores puntuaciones.

### Definition of Done
- La funcionalidad y diseño han sido aprobados en todos los dispositivos compatibles.
- La accesibilidad del flujo ha sido verificada.

---

## 8. Editar perfil

### Descripción
Como usuario de Melodle, quiero poder editar mi perfil para personalizarlo a mi gusto.

### Criterios de aceptación
- Debe haber un botón para acceder al perfil del usuario.
- Si el usuario no está vinculado con Spotify, debe poder cambiar su nombre, nombre de usuario, contraseña y foto de perfil.
- Si el usuario está vinculado con Spotify, solo debe poder cambiar su nombre de usuario.
- El usuario puede agregar hasta 4 artistas favoritos a su perfil.
- Debe existir un listado de seguidores y seguidos, con la opción de eliminar usuarios.

### Prioridad
Alta

### Estimación
8 puntos

### Notas adicionales
- La funcionalidad debe ser accesible.

### Definition of Ready
- El usuario puede realizar y visualizar cambios en su perfil.
- Se puede editar la lista de seguidores y seguidos.

### Definition of Done
- La funcionalidad y diseño han sido aprobados en todos los dispositivos compatibles.
- La accesibilidad del flujo ha sido verificada.

---

## 9. Puntuación

### Descripción
Como usuario de Melodle, quiero poder visualizar mi puntuación y la de mis amigos en el leaderboard para competir y mejorar mi rendimiento.

### Criterios de aceptación
- Debe existir un contador de días consecutivos jugando (racha).
- Debe existir un contador de Wordles ganados.
- La puntuación final debe ser un promedio de ambos contadores.

### Prioridad
Media

### Estimación
3 puntos

### Notas adicionales
- La funcionalidad debe ser accesible.

### Definition of Ready
- El usuario puede visualizar su puntuación y la de sus amigos en el leaderboard.

### Definition of Done
- La funcionalidad y diseño han sido aprobados en todos los dispositivos compatibles.
- La accesibilidad del flujo ha sido verificada.
