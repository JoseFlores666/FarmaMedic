export const errorMessages = {
    usuario: {
        required: "El usuario es obligatorio.",
        invalid: "Usuario no válido. Debe tener entre 3 y 15 caracteres."
    },
    nombre: {
        required: "El nombre es obligatorio.",
        invalid: "Nombre no válido. Solo se permiten letras y espacios."
    },
    apellidoPaterno: {
        required: "El apellido paterno es obligatorio.",
        invalid: "Apellido paterno no válido. Solo se permiten letras y espacios."
    },
    apellidoMaterno: {
        required: "El apellido materno es obligatorio.",
        invalid: "Apellido materno no válido. Solo se permiten letras y espacios."
    },
    edad: {
        required: "La edad es obligatoria.",
        invalid: "La edad no es válida. Debe ser un número entre 18 y 100."
    },
    telefono: {
        required: "El teléfono es obligatorio.",
        invalid: "Teléfono no válido."
    },
    correo: {
        required: "El correo es obligatorio.",
        missingAt: "El correo debe contener el símbolo '@'.",
        invalid: "El correo no es válido. Asegúrate de que esté en el formato correcto."
    },
    password: {
        required: "La contraseña es obligatoria.",
        invalid: "Contraseña con acentos '."
    },
    confirmPassword: {
        required: "La confirmación de la contraseña es obligatoria.",
    },
    pregunta: {
        required: "Por favor, selecciona una pregunta de recuperación."
    },
    genero: {
        required: "Por favor, selecciona un género."
    }
};

export const validateUsuario = (usuario) => {
    if (!usuario.trim()) return errorMessages.usuario.required;
    if (!/^[a-zA-Z0-9]{3,15}$/.test(usuario)) return errorMessages.usuario.invalid;
    return null;
};

export const validateNombre = (nombre) => {
    if (!nombre.trim()) return errorMessages.nombre.required;
    if (!/^[a-zA-ZÀ-ÿ\s]{2,50}$/.test(nombre)) return errorMessages.nombre.invalid;
    return null;
};

export const validateApellidoPaterno = (apellidoPaterno) => {
    if (!apellidoPaterno.trim()) return errorMessages.apellidoPaterno.required;
    if (!/^[a-zA-ZÀ-ÿ\s]{2,50}( [a-zA-ZÀ-ÿ\s]{2,50})?$/.test(apellidoPaterno)) return errorMessages.apellidoPaterno.invalid;
    return null;
};

export const validateApellidoMaterno = (apellidoMaterno) => {
    if (!apellidoMaterno.trim()) return errorMessages.apellidoMaterno.required;
    if (!/^[a-zA-ZÀ-ÿ\s]{2,50}( [a-zA-ZÀ-ÿ\s]{2,50})?$/.test(apellidoMaterno)) return errorMessages.apellidoMaterno.invalid;
    return null;
};

export const validateEdad = (edad) => {
    if (!edad.trim()) return errorMessages.edad.required;
    if (!/^(1[89]|[2-9]\d|100)$/.test(edad)) return errorMessages.edad.invalid;
    return null;
};

export const validateTelefono = (telefono) => {
    if (!telefono.trim()) return errorMessages.telefono.required;
    if (!/^[0-9]{10}$/.test(telefono)) return errorMessages.telefono.invalid;
    return null;
};

export const validateCorreo = (correo) => {
    if (!correo.trim()) return errorMessages.correo.required;
    if (!correo.includes('@')) return errorMessages.correo.missingAt;
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo)) return errorMessages.correo.invalid;
    return null;
};

export const validatePassword = (password) => {
    if (!password.trim()) return errorMessages.password.required;
    if (!/^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-zñÑ\d$@$!%*?&#.$($)$-$_]{8,20}$/.test(password)) {
        return errorMessages.password.invalid;
    }
    return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword.trim()) return errorMessages.confirmPassword.required;
    if (password !== confirmPassword);
    return null;
};

export const validatePregunta = (pregunta) => {
    if (!pregunta) return errorMessages.pregunta.required;
    return null;
};

export const validateGenero = (genero) => {
    if (!genero) return errorMessages.genero.required;
    return null;
};
