### Formato de las validaciones requeridas.

- Contraseña:
    - Debe contener, por lo menos, una letra mayúscula, minúscula, un dígito y
        un símbolo de entre `@$!%*?&`. Además, debe tener un largo entre 8 y 20
        caracteres inclusive.
    - Regex: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$`

- Email:
    - Regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$`

- Nombre de usuario:
    - Debe contener únicamente caracteres utf8, y tener entre 3 y 20 caracteres.

- Id de usuario:
    - TODO
