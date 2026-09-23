document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // OBTENER USUARIOS
    // ==========================================

    let usuarios =
        JSON.parse(localStorage.getItem("travelUsers")) || [];


    // ==========================================
    // CREAR CUENTAS DE PRUEBA SOLO SI NO EXISTEN
    // ==========================================

    const adminExiste = usuarios.some(
        u =>
            u.email &&
            u.email.toLowerCase() === "admin@reservas.com"
    );

    if (!adminExiste) {

        usuarios.push({
            id: 1,
            nombre: "Administrador",
            email: "admin@reservas.com",
            telefono: "3000000000",
            password: "Admin123",
            role: "admin"
        });
    }


    const usuarioExiste = usuarios.some(
        u =>
            u.email &&
            u.email.toLowerCase() === "usuario@reservas.com"
    );

    if (!usuarioExiste) {

        usuarios.push({
            id: 2,
            nombre: "Usuario de prueba",
            email: "usuario@reservas.com",
            telefono: "3000000001",
            password: "Usuario123",
            role: "user"
        });
    }


    localStorage.setItem(
        "travelUsers",
        JSON.stringify(usuarios)
    );


    // ==========================================
    // INICIO DE SESIÓN
    // ==========================================

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();

            const password =
                document
                    .getElementById("password")
                    .value;


            usuarios =
                JSON.parse(
                    localStorage.getItem("travelUsers")
                ) || [];


            const usuarioEncontrado =
                usuarios.find(function (usuario) {

                    return (
                        usuario.email &&
                        usuario.email.toLowerCase() === email &&
                        usuario.password === password
                    );

                });


            if (!usuarioEncontrado) {

                alert(
                    "Correo o contraseña incorrectos."
                );

                return;
            }


            // GUARDAR SESIÓN

            localStorage.setItem(
                "currentUser",
                JSON.stringify(usuarioEncontrado)
            );


            // REDIRECCIONAR

            if (
                usuarioEncontrado.role === "admin"
            ) {

                window.location.href =
                    "admin.html";

            } else {

                window.location.href =
                    "usuario.html";

            }

        });
    }


    // ==========================================
    // REGISTRO DE NUEVOS USUARIOS
    // ==========================================

    const registroForm =
        document.getElementById("registroForm");

    if (registroForm) {

        registroForm.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();


                const nombre =
                    document
                        .getElementById("nombre")
                        .value
                        .trim();

                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim()
                        .toLowerCase();

                const telefono =
                    document
                        .getElementById("telefono")
                        .value
                        .trim();

                const password =
                    document
                        .getElementById("password")
                        .value;

                const confirmar =
                    document
                        .getElementById("confirmarPassword")
                        .value;

                const mensaje =
                    document.getElementById("mensaje");


                if (password !== confirmar) {

                    mensaje.textContent =
                        "Las contraseñas no coinciden.";

                    mensaje.style.color = "red";

                    return;
                }


                usuarios =
                    JSON.parse(
                        localStorage.getItem("travelUsers")
                    ) || [];


                const existe =
                    usuarios.some(
                        u =>
                            u.email &&
                            u.email.toLowerCase() === email
                    );


                if (existe) {

                    mensaje.textContent =
                        "Ese correo ya está registrado.";

                    mensaje.style.color = "red";

                    return;
                }


                const nuevoUsuario = {

                    id: Date.now(),

                    nombre: nombre,

                    email: email,

                    telefono: telefono,

                    password: password,

                    role: "user"

                };


                usuarios.push(nuevoUsuario);


                localStorage.setItem(
                    "travelUsers",
                    JSON.stringify(usuarios)
                );


                mensaje.textContent =
                    "Cuenta creada correctamente.";

                mensaje.style.color = "green";


                registroForm.reset();


                setTimeout(function () {

                    window.location.href =
                        "index.html";

                }, 1200);

            }
        );
    }

});