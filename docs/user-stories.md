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

- Orden de prioridades:
    Detalle < Baja < Media < Alta < Vital

## Historia de Usuario - Registro de nuevo usuario en Melodle

### Descripción
Como nuevo usuario, quiero poder registrarme en Melodle para poder hacer uso
de sus funcionalidades.

### Criterios de aceptación [ ]

- [ ] Debe existir un botón para registrarse en la pantalla de login.
- [ ] La pantalla de registro debe permitir crear la cuenta mediante:
  - [ ] Correo electrónico y contraseña
  - [ ] Autenticación por Spotify
- [ ] Se debe solicitar un nombre de usuario que puede ser repetido.
- [ ] Se debe asignar una ID expuesta que diferencie al usuario de otros con el
      mismo nombre.
- [ ] El sistema debe validar que:
    - [ ] ...el email [ ], la contraseña [ ] y el nombre de usuario [ ] cumplen
             con el [formato](./validaciones.md).
    - [~] ...el nombre de usuario no tiene significado demasiado inapropiado.
        - [ ] En caso de ser implausible, los usuarios deben poder reportar
              nombres de usuario inapropiados.
- [ ] Se deben mostrar mensajes de error claros en caso de datos inválidos o
      problemas en el registro.
- [~] Permitir al usuario seleccionar una foto de perfil.
    - [~] El usuario puede seleccionar de una selección de fotos de perfil.
    - [~] El usuario puede seleccionar subir una foto de perfil personalizada.
        - [ ] No se puden permitir fotos inapropiadas.

### Prioridad
Vital

### Estimación
5 puntos

### Definition of Ready [ ]

- [ ] El diseño de la interfaz de usuario para el registro está aprobado.
- [ ] Los requisitos de seguridad para contraseñas están definidos.
- [ ] La integración con la autenticación de Spotify está configurada.
- [ ] Las pruebas de accesibilidad están definidas.

### Definition of Done [ ]

- [ ] Todos los criterios de aceptación han sido implementados y probados.
- [ ] La funcionalidad ha sido probada en todos los dispositivos compatibles.
- [ ] Se ha verificado la accesibilidad del flujo para personas con discapacidad visual.
- [ ] El código ha pasado la revisión de pares.
- [ ] La documentación del usuario ha sido actualizada.
- [ ] Las pruebas de integración y unitarias están implementadas y pasando.

#### Notas adicionales

- Ninguna.

--------------------------------------------------------------------------------

## Historia de Usuario - Inicio de Sesión en Melodle

### Descripción
Como usuario registrado, quiero poder iniciar sesión en Melodle para acceder a
mis datos y utilizar las funcionalidades de la aplicación.

### Criterios de aceptación [ ]
- [ ] Debe existir una pantalla de inicio de sesión accesible desde la página principal.
- [ ] La pantalla de inicio de sesión debe permitir autenticarse mediante:
    - [ ] Correo electrónico y contraseña
    - [ ] Autenticación por Spotify
- [ ] El sistema debe validar que:
    - [ ] El correo electrónico y la contraseña cumplen con el [formato](./validaciones.md) establecido.
    - [ ] Las credenciales ingresadas corresponden a un usuario registrado.
- [ ] Se deben mostrar mensajes de error claros en caso de credenciales inválidas o problemas en el inicio de sesión.
- [ ] Debe existir una opción para recuperar la contraseña en caso de olvido.
- [ ] La sesión debe mantenerse activa hasta que el usuario decida cerrarla o expire por inactividad.
- [ ] Debe haber una opción para "Recordarme" que mantenga la sesión activa por un período más largo.

### Prioridad
Vital

### Estimación
4 puntos

### Definition of Ready [ ]

- [ ] El diseño de la interfaz de usuario para el inicio de sesión está aprobado.
- [ ] La integración con la autenticación de Spotify está configurada.
- [ ] Las pruebas de accesibilidad están definidas.
- [ ] El proceso de recuperación de contraseña está definido.

### Definition of Done [ ]

- [ ] Todos los criterios de aceptación han sido implementados y probados.
- [ ] La funcionalidad ha sido probada en todos los dispositivos compatibles.
- [ ] Se ha verificado la accesibilidad del flujo para personas con discapacidad visual.
- [ ] El código ha pasado la revisión de pares.
- [ ] La documentación del usuario ha sido actualizada.
- [ ] Las pruebas de integración y unitarias están implementadas y pasando.
- [ ] Se ha verificado la seguridad del proceso de inicio de sesión.

### Notas adicionales
- Asegurar que el proceso de inicio de sesión sea rápido y eficiente.
- [~] Considerar la implementación de autenticación de dos factores como una mejora futura.

--------------------------------------------------------------------------------

## Historia de Usuario - Juego Diario de Melodle

### Descripción
Como usuario de Melodle, quiero poder jugar una vez al día para intentar
adivinar una línea de una canción, de manera similar a Wordle, para poner a
prueba mi conocimiento musicales y disfrutar de un desafío diario.

### Criterios de aceptación [ ]

- [ ] El juego debe estar disponible una vez al día para cada usuario.
- [ ] Con la misma configuración, cada usuario debería ver el mismo wordle en el
      mismo día.
- [ ] El juego debe proporcionar pistas o feedback después de cada intento del usuario.
- [ ] El usuario debe tener un número limitado de intentos para adivinar la línea correcta (el número exacto está por definir).
- [ ] El juego debe mostrar el progreso del usuario (intentos usados/restantes).
- [ ] Al finalizar el juego (sea por acierto o por agotar los intentos), se debe mostrar la respuesta correcta.
- [ ] Debe haber un temporizador que indique cuándo estará disponible el próximo juego.
- [ ] El juego debe ser accesible para personas con discapacidad visual.

### Prioridad
Alta

### Estimación
8 puntos

### Definition of Ready [ ]

- [ ] Las reglas exactas del juego están definidas y documentadas.
- [ ] El diseño de la interfaz de usuario para el juego está aprobado.
- [ ] Se ha definido la fuente y el método de selección de las canciones/líneas para el juego.
- [ ] Se han establecido los criterios para determinar si una respuesta del usuario es correcta, parcialmente correcta o incorrecta.

### Definition of Done [ ]

- [ ] Todos los criterios de aceptación han sido implementados y probados.
- [ ] La funcionalidad ha sido probada en todos los dispositivos compatibles.
- [ ] Se ha verificado la accesibilidad del juego para personas con discapacidad visual.
- [ ] El código ha pasado la revisión de pares.
- [ ] La documentación del usuario, incluyendo las reglas del juego, ha sido creada y revisada.
- [ ] Las pruebas de integración y unitarias están implementadas y pasando.
- [ ] Se ha realizado una prueba de usuario para verificar la jugabilidad y la diversión del juego.

### Notas adicionales
- Las reglas exactas del juego están pendientes de definición. Esto incluye:
  - El número exacto de intentos permitidos.
  - El método específico para proporcionar pistas o feedback.
  - Los criterios precisos para determinar respuestas parcialmente correctas.
  - La posible inclusión de categorías musicales o niveles de dificultad.
- Considerar la implementación de un sistema de puntuación o logros para aumentar la rejugabilidad.
- Explorar la posibilidad de compartir resultados en redes sociales para aumentar la viralidad del juego.

--------------------------------------------------------------------------------

## Historia de Usuario - Configuración del Juego en Melodle

### Descripción
Como usuario de Melodle, quiero poder personalizar la configuración del juego
diario para seleccionar diferentes modos y filtros, como elegir ciertos artistas
o adivinar el nombre del artista en base a una línea de su canción, para tener
una experiencia más adaptada a mis gustos musicales.

### Criterios de aceptación [ ]

- [ ] El usuario debe poder filtrar las canciones por artista o género antes de comenzar el juego.
- [ ] Debe haber un modo alternativo donde el usuario adivine el nombre del artista basado en una línea de una canción.
- [ ] En el modo por artista, las canciones deben pertenecer únicamente al
      artista seleccionado o al género filtrado.
- [ ] El usuario debe poder guardar su configuración preferida para futuros juegos.
- [ ] La configuración debe ser accesible desde la pantalla de inicio del juego
      y fácil de modificar.
- [~] Si el usuario tiene configurada su sesión con Spotify, se debe dar una
      configuración recomendada en base a la información de su cuenta de Spotify.

### Prioridad
Media

### Estimación
5 puntos

### Definition of Ready [ ]

- [ ] Se han definido los filtros y modos disponibles en el juego.
- [ ] El diseño de la interfaz para la configuración ha sido aprobado.
- [ ] Se ha definido cómo se seleccionarán las canciones basadas en los filtros aplicados.

### Definition of Done [ ]

- [ ] Todos los criterios de aceptación han sido implementados y probados.
- [ ] La funcionalidad ha sido probada en todos los dispositivos compatibles.
- [ ] La configuración ha sido integrada con el flujo del juego principal.
- [ ] El código ha pasado la revisión de pares.
- [ ] La documentación del usuario, incluyendo las opciones de configuración, ha sido creada y revisada.
- [ ] Las pruebas de integración y unitarias están implementadas y pasando.
- [ ] Se ha realizado una prueba de usuario para verificar la usabilidad y personalización de la configuración.

### Notas adicionales
- Es importante que los filtros y los modos no afecten la jugabilidad diaria
    compartida, por lo que se debe limitar la personalización a ciertos aspectos
    que no comprometan la competencia justa entre usuarios.
- Considerar la posibilidad de desbloquear ciertos modos o filtros como logros dentro del juego.

--------------------------------------------------------------------------------

## Historia de Usuario - Página de Inicio de Melodle

### Descripción
Como usuario de Melodle, quiero que mi página de inicio muestre una lista
personalizada de mis artistas favoritos, con información relevante sobre sus
proyectos y la opción de interactuar con ellos en el juego de Melodle, para
mantenerme informado de sus novedades y participar más activamente en el juego.

### Criterios de aceptación [ ]

- [ ] El usuario debe poder agregar artistas favoritos a la lista desde la
      página de inicio mediante un botón claro y accesible.
- [ ] Cada artista en la lista debe mostrar:
    - [ ] Nombre del artista.
    - [ ] Imagen del artista.
    - [~] Información relevante sobre sus próximos proyectos, como giras, álbumes y canciones.
    - [ ] Un botón para jugar al modo de Melodle relacionado con ese artista (si está disponible).
- [ ] La información debe actualizarse automáticamente para reflejar las novedades de cada artista.

### Prioridad
Media

### Estimación
5 puntos

### Definition of Ready [ ]

- [ ] Se ha definido el formato de los datos que aparecerán en la página (proyectos, imágenes, etc.).
- [ ] El diseño de la página de inicio, incluyendo la interfaz para agregar y mostrar artistas, ha sido aprobado.
- [ ] Se ha implementado la integración con las fuentes de datos sobre proyectos futuros de los artistas.

### Definition of Done [ ]

- [ ] Todos los criterios de aceptación han sido implementados y probados.
- [ ] La funcionalidad ha sido verificada en todos los dispositivos compatibles (móviles y escritorio).
- [ ] Se ha probado la accesibilidad de la página de inicio, y es compatible con herramientas de asistencia.
- [ ] El código ha pasado la revisión de pares.
- [ ] La documentación del usuario, incluyendo cómo agregar artistas y navegar por la página de inicio, ha sido creada y revisada.
- [ ] Se han implementado y pasado las pruebas unitarias e integrales.

### Notas adicionales

- Considerar la posibilidad de enviar notificaciones al usuario cuando haya
    actualizaciones sobre sus artistas favoritos (nuevas giras, lanzamientos, etc.).
- La funcionalidad debe ser diseñada de manera que el usuario pueda personalizar
    fácilmente su lista de favoritos y recibir actualizaciones en tiempo real.

--------------------------------------------------------------------------------

## Historia de Usuario - Agregar Amigos en Melodle

### Descripción
Como usuario de Melodle, quiero poder agregar amigos para competir en el juego
de Melodle (Wordle musical) y comparar nuestras puntuaciones, para disfrutar de
una experiencia más social y motivadora a través de la competencia amistosa.

### Criterios de aceptación [ ]
- [ ] El usuario debe poder agregar amigos mediante búsqueda por:
    - [ ] nombre de usuario
    - [ ] id
- [ ] El sistema debe permitir la sincronización de amigos desde plataformas
      externas, como Spotify, si el usuario lo desea y la plataforma lo permite.
- [ ] Debe haber una sección dedicada donde se muestre una lista de amigos
      agregados, indicando si fueron agregados manualmente o sincronizados.
- [ ] El juego debe incluir un leaderboard visible en la página de amigos, que
      muestre las puntuaciones diarias de los amigos en el juego de Melodle.
- [ ] El usuario debe poder ver el perfil de sus amigos, que incluya información
      básica y su rendimiento en el juego.

### Prioridad
Media

### Estimación
8 puntos

### Definition of Ready [ ]
- [ ] El diseño de la interfaz de agregar amigos y sincronización con
      plataformas ha sido aprobado.
- [ ] Los criterios de cómo se mostrarán las puntuaciones en el leaderboard han
      sido definidos.
- [ ] Se ha integrado el sistema de perfiles de amigos y cómo se manejarán las
      solicitudes de amistad.

### Definition of Done [ ]
- [ ] Todos los criterios de aceptación han sido implementados y probados.
- [ ] La funcionalidad ha sido verificada en todos los dispositivos compatibles
      (móviles y escritorio).
- [ ] La accesibilidad del proceso de agregar amigos y visualizar sus
      puntuaciones ha sido probada.
- [ ] El código ha pasado la revisión de pares.
- [ ] La documentación del usuario, incluyendo cómo agregar amigos y competir,
      ha sido creada y revisada.
- [ ] Se han implementado y pasado las pruebas unitarias e integrales, y se ha
      verificado el funcionamiento del leaderboard.

### Notas adicionales
- Considerar implementar notificaciones cuando un amigo ha sido agregado o
    cuando un amigo mejora rebasa al usuario en el leaderboard.
- Explorar la posibilidad de compartir resultados o logros en redes sociales
    para fomentar la interacción y viralidad del juego.
- Evaluar la opción de añadir chats o mensajes directos entre amigos en futuras
    versiones, para aumentar la interacción social dentro de la plataforma.

--------------------------------------------------------------------------------

# Historia de Usuario - Editar Perfil en Melodle

## Descripción
Como usuario de Melodle, quiero poder editar mi perfil para personalizar mi
experiencia en la plataforma, cambiar mi información personal, y gestionar mis
seguidores y seguidos, para que mi perfil refleje mis preferencias y permita un
mejor control sobre mi red social en el juego.

## Criterios de aceptación [ ]
- [ ] El usuario debe poder acceder a la sección de perfil desde un botón o
      ícono visible en la interfaz principal.
- [ ] Si el usuario no está vinculado con Spotify, debe poder:
  - [ ] Cambiar su nombre.
  - [ ] Cambiar su nombre de usuario.
  - [ ] Cambiar su contraseña.
  - [ ] Cambiar su foto de perfil.
- [ ] Si el usuario está vinculado con Spotify, solo debe poder cambiar su
      nombre de usuario.
- [ ] Todos los cambios deben ser [validados](./validaciones.md).
- [ ] El usuario debe poder agregar hasta 4 artistas favoritos a su perfil, que
      se mostrarán públicamente.
- [ ] El perfil debe mostrar una lista de seguidores y usuarios seguidos, con
      la opción de eliminar a cualquier usuario de esas listas.

## Prioridad
Alta

## Estimación
8 puntos

## Definition of Ready [ ]
- [ ] Se ha definido el diseño de la página de perfil, incluyendo la interfaz
      para editar la información personal y gestionar seguidores.
- [ ] Se han establecido los criterios de qué información puede ser editada
      dependiendo de la vinculación del usuario con Spotify.
- [ ] Se ha aprobado el diseño y formato de la sección de artistas favoritos.

## Definition of Done [ ]
- [ ] Todos los criterios de aceptación han sido implementados y probados.
- [ ] La funcionalidad ha sido verificada en todos los dispositivos compatibles
      (móviles y escritorio).
- [ ] La accesibilidad del proceso de edición de perfil ha sido probada con
      herramientas de asistencia.
- [ ] El código ha pasado la revisión de pares.
- [ ] La documentación del usuario, incluyendo cómo editar el perfil y gestionar
      seguidores, ha sido creada y revisada.
- [ ] Se han implementado y pasado las pruebas unitarias e integrales para
      garantizar la correcta funcionalidad de edición de perfil.

## Notas adicionales
- Considerar la implementación de notificaciones para avisar a los seguidores
    cuando un usuario cambia su perfil o actualiza sus artistas favoritos.
- Explorar la posibilidad de integrar más plataformas, además de Spotify, para
    obtener información adicional en el perfil del usuario.
- Evaluar la posibilidad de implementar una vista previa del perfil antes de
    guardar los cambios.

--------------------------------------------------------------------------------

# Historia de Usuario - Sistema de Puntuación en Melodle

## Descripción
Como usuario de Melodle, quiero poder visualizar mi puntuación y compararla con
la de mis amigos en un leaderboard, para fomentar la competencia amistosa y
motivarme a mejorar mi rendimiento en el juego.

## Criterios de aceptación [ ]
- [ ] El usuario debe poder ver un contador de días consecutivos ganando ("racha").
- [ ] El usuario debe tener un contador que refleje la cantidad total de Wordles
      ganados.
- [ ] La puntuación final debe calcularse como un promedio ponderado entre la
      racha de días consecutivos, la cantidad de Wordles ganados y el promedio
      de intentos necesarios para ganar los wordles.
- [ ] El usuario debe poder ver la mayor racha que ha tenido.
- [ ] El leaderboard debe mostrar la puntuación del usuario junto con la de sus amigos.
    - [~] Las puntuaciones se deben actualizar en tiempo real.
- [ ] El usuario debe poder acceder al leaderboard desde la página principal o
      la sección de amigos.

## Prioridad
Media

## Estimación
3 puntos

## Definition of Ready [ ]
- [ ] El diseño del leaderboard y los criterios de cálculo de puntuación han
      sido aprobados.
- [~] Se ha definido cómo se actualizarán los contadores (racha y Wordles
      ganados) en tiempo real.

## Definition of Done [ ]
- [ ] Todos los criterios de aceptación han sido implementados y probados.
- [ ] La funcionalidad ha sido verificada en todos los dispositivos compatibles
      (móviles y escritorio).
- [ ] La accesibilidad del sistema de puntuación y leaderboard ha sido probada y
      verificada.
- [ ] El código ha pasado la revisión de pares.
- [ ] La documentación del usuario, incluyendo cómo visualizar la puntuación y
      el leaderboard, ha sido creada y revisada.
- [ ] Las pruebas unitarias e integrales se han implementado y están pasando
      correctamente.

## Notas adicionales
- Considerar la posibilidad de incluir logros adicionales para premiar largas
    rachas o altas puntuaciones.
- Explorar la opción de mostrar gráficos que resalten la evolución de la
    puntuación del usuario a lo largo del tiempo.
- Implementar notificaciones para avisar al usuario cuando haya subido
    posiciones en el leaderboard o cuando un amigo lo supere.
