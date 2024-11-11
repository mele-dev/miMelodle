# Melodle

Equipo 4 - Juan Tanca, Cristian Rodriguez, Juana López

## Sobre nuestro proyecto

### Idea

Pensamos desarrollar una versión innovadora de Wordle, pero con un giro
especial: en lugar de palabras aleatorias, las respuestas estarán inspiradas en
letras de canciones de los artistas favoritos de cada usuario.

Wordle es un juego de palabras en línea en el que los jugadores deben adivinar
una palabra de cinco letras en un máximo de seis intentos. Tras cada intento, el
juego ofrece retroalimentación visual:

-   Las letras correctas y en la posición exacta se marcan en verde.
-   Las letras correctas pero en una posición incorrecta se resaltan en
    amarillo.
-   Las letras que no están en la palabra se muestran en gris.

Wordle ofrece solo un juego por día, lo que significa que cada jugador recibe la
misma palabra para adivinar en un día determinado. Después de resolver o fallar
el desafío, no se puede jugar nuevamente hasta el día siguiente.

### ¿Cómo lo haremos?

Para lograr esto, planeamos integrar la API de musixmatch y Spotify para
desarrolladores, que nos permitirá acceder a un vasto catálogo de canciones.

Nuestra base de datos estará diseñada para almacenar información de los
usuarios, lo que permitirá personalizar su experiencia, competir en tablas de
clasificación y compararse con sus amigos.

> [!NOTE] Para más información, vea [la documentación](./docs)

## Notas para profesores:

-   Bases de datos:
    -   Hay un archivo de drawio con el [mer](./docs/mer.drawio)
    -   Hay una imagen con el [diagrama físico](./docs/diagrama_físico.png)
    -   Existe un archivo [ddl](./db/init.sql)
    -   Nuestras queries DML se encuentra en
        [la carpeta de queries](./backend/src/queries/).
    -   Solo necesitamos insertar las fotos de perfil, y las mismas se generan
        dinámicamente mediante
        [un script al iniciar el backend](./backend/src/services/files.ts)

-   Desarrollo Web:
    -   Las tecnologías utilizadas, por fuera de las presentadas en clase, las
        justificamos en
        [el archivo de justificaciones](./docs/technologyJustification.md).
    -   Muy probablemente el diagrama físico y mer se encuentren desactualizados
        cuando los vea. Utilize alguna herramienta de autogeneración para
        verlos, nosotros hacemos eso; solo los actualizamos para entregas de
        bases de datos.
    -   Tenemos un [diagrama de rutas](./docs/rutas-melodle.png).
