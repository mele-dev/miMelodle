## Justificación de tecnologías.

### pgTyped

Para nuestras queries utilizamos pgTyped para poder tener confianza en los tipos
de las queries que hacemos a la base de datos. Consideramos que podemos conseguir
un workflow bastante ergonómico con esta poca generación de código, y esto nos
permite saber que nuestras queries y nuestros schemas son compatibles de forma
temprana.

### Tailwind

No queremos usar bootstrap y a Cristian le gusta Tailwind porque es más fácil
de debuggear y las herramientas de desarollo de tailwind son cómodas.

### Orval

Lo utilizamos para el código de comunicación de apis que mantengan un schema
de openapi (o que les podamos generar uno de alguna manera). La elección de
orval en específico para este fin es bastante arbitraria, hay demasiadas
librerías que hacen esto mismo.

La mayor utilidad que nos brinda es poder acceder sin grandes complicaciones
a los endpoints de nuestro backend, sin tener que crear los tipos nosotros.
De esta forma estamos 1) Teniendo un trabajo más sencillo, y 2) Validando que
nuestro schema de openapi esta bien hecho.

### Axios

Utilizamos axios para algunas requests manuales a apis porque es el por defecto
que usa orval.

### Faker

Utilizamos faker para generar datos artificiales con fines de depuración. No
investigamos mucho las opciones que tenemos, ya que no es un problema ni
importante ni complicado.
