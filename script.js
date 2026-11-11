const API =
    "https://leza-socios-api.lezafest.workers.dev";


/* =========================
   ELEMENTOS
========================= */

const presentacion =
    document.querySelector(".presentacion");

const seccionBusqueda =
    document.getElementById("seccionBusqueda");

const seccionSocio =
    document.getElementById("seccionSocio");

const resultado =
    document.getElementById("resultado");


const irBuscar =
    document.getElementById("irBuscar");

const irHacerSocio =
    document.getElementById("irHacerSocio");

const volverBusqueda =
    document.getElementById("volverBusqueda");

const volverInicio =
    document.getElementById("volverInicio");

const seccionBienvenida =
    document.getElementById("seccionBienvenida");

const bienvenidaNombre =
    document.getElementById("bienvenidaNombre");

const carnetSocio =
    document.getElementById("carnetSocio");

const infoNombre =
    document.getElementById("infoNombre");

const infoEmail =
    document.getElementById("infoEmail");

const infoCodigo =
    document.getElementById("infoCodigo");

const infoEstado =
    document.getElementById("infoEstado");   
    
const seccionBeneficios =
    document.getElementById(
        "seccionBeneficios"
    );

const listaBeneficios =
    document.getElementById(
        "listaBeneficios"
    );    


/* =========================
   BÚSQUEDA
========================= */

const formBusqueda =
    document.getElementById("formBusqueda");

const codigoInput =
    document.getElementById("codigo");

const estado =
    document.getElementById("estado");

const fotoPersona =
    document.getElementById("fotoPersona");

const tipoPersona =
    document.getElementById("tipoPersona");

const nombrePersona =
    document.getElementById("nombrePersona");

const funcionPersona =
    document.getElementById("funcionPersona");

const codigoPersona =
    document.getElementById("codigoPersona");

const verCarnet =
    document.getElementById("verCarnet");


/* =========================
   HACERSE SOCIO
========================= */

const formSocio =
    document.getElementById("formSocio");

const fotoSocio =
    document.getElementById("fotoSocio");

const previewSocio =
    document.getElementById("previewSocio");

const estadoSocio =
    document.getElementById("estadoSocio");


let personaActual = null;


/* =========================
   MOSTRAR INICIO
========================= */

function mostrarInicio() {

    presentacion.classList.remove("oculto");

    seccionBusqueda.classList.add("oculto");

    seccionSocio.classList.add("oculto");

    resultado.classList.add("oculto");

}


/* =========================
   MOSTRAR BÚSQUEDA
========================= */

function mostrarBusqueda() {

    presentacion.classList.add("oculto");

    seccionBusqueda.classList.remove("oculto");

    seccionSocio.classList.add("oculto");

    resultado.classList.add("oculto");

}


/* =========================
   MOSTRAR SOCIO
========================= */

function mostrarFormularioSocio() {

    presentacion.classList.add("oculto");

    seccionBusqueda.classList.add("oculto");

    resultado.classList.add("oculto");

    seccionSocio.classList.remove("oculto");

}


/* =========================
   BOTONES
========================= */

irBuscar.addEventListener(
    "click",
    mostrarBusqueda
);


irHacerSocio.addEventListener(
    "click",
    mostrarFormularioSocio
);


volverBusqueda.addEventListener(
    "click",
    mostrarInicio
);


volverInicio.addEventListener(
    "click",
    mostrarInicio
);


/* =========================
   PREVISUALIZAR FOTO
========================= */

fotoSocio.addEventListener(
    "change",
    () => {

        const archivo =
            fotoSocio.files[0];


        if (!archivo) {

            previewSocio.src = "";

            previewSocio.classList.add("oculto");

            return;

        }


        const lector =
            new FileReader();


        lector.onload =
            event => {

                previewSocio.src =
                    event.target.result;

                previewSocio.classList.remove(
                    "oculto"
                );

            };


        lector.readAsDataURL(
            archivo
        );

    }
);


/* =========================
   OPTIMIZAR FOTO
========================= */

function optimizarImagen(archivo) {

    return new Promise(
        (resolve, reject) => {

            const lector =
                new FileReader();


            lector.onerror =
                () => {

                    reject(
                        new Error(
                            "No se pudo leer la imagen."
                        )
                    );

                };


            lector.onload =
                event => {

                    const imagen =
                        new Image();


                    imagen.onerror =
                        () => {

                            reject(
                                new Error(
                                    "La imagen no es válida."
                                )
                            );

                        };


                    imagen.onload =
                        () => {

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            const MAXIMO =
                                600;


                            let ancho =
                                imagen.width;

                            let alto =
                                imagen.height;


                            if (
                                ancho > MAXIMO ||
                                alto > MAXIMO
                            ) {

                                if (ancho > alto) {

                                    alto =
                                        Math.round(
                                            alto *
                                            MAXIMO /
                                            ancho
                                        );

                                    ancho =
                                        MAXIMO;

                                } else {

                                    ancho =
                                        Math.round(
                                            ancho *
                                            MAXIMO /
                                            alto
                                        );

                                    alto =
                                        MAXIMO;

                                }

                            }


                            canvas.width =
                                ancho;

                            canvas.height =
                                alto;


                            const contexto =
                                canvas.getContext(
                                    "2d"
                                );


                            contexto.drawImage(
                                imagen,
                                0,
                                0,
                                ancho,
                                alto
                            );


                            resolve(

                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.85
                                )

                            );

                        };


                    imagen.src =
                        event.target.result;

                };


            lector.readAsDataURL(
                archivo
            );

        }
    );

}


/* =========================
   REGISTRAR SOCIO
========================= */

formSocio.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const nombre =
            document
                .getElementById("nombreSocio")
                .value
                .trim();


        const email =
            document
                .getElementById("emailSocio")
                .value
                .trim();


        const archivo =
            fotoSocio.files[0];


        if (!archivo) {

            estadoSocio.textContent =
                "Seleccioná una foto.";

            return;

        }


        try {

            estadoSocio.textContent =
                "Preparando foto...";


            const foto =
                await optimizarImagen(
                    archivo
                );


            estadoSocio.textContent =
                "Registrando socio...";


            const respuesta =
                await fetch(
                    API + "/api/socios",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                nombre,
                                email,
                                foto

                            })

                    }
                );


            const datos =
                await respuesta.json();


            if (
                !respuesta.ok ||
                !datos.correcto
            ) {

                throw new Error(
                    datos.error ||
                    "No se pudo registrar."
                );

            }

            const socio =
                datos.socio;


            /* OCULTAR FORMULARIO */

            seccionSocio.classList.add(
                "oculto"
            );


            /* OCULTAR OTRAS SECCIONES */

            presentacion.classList.add(
                "oculto"
            );

            seccionBusqueda.classList.add(
                "oculto"
            );

            resultado.classList.add(
                "oculto"
            );


            /* MOSTRAR BIENVENIDA */

            seccionBienvenida.classList.remove(
                "oculto"
            );


            /* SALUDO */

            bienvenidaNombre.textContent =
                "Hola, " + socio.nombre + " 👋";


            /* CARGAR CARNET */

            carnetSocio.src =
                API +
                "/index.html?codigo=" +
                encodeURIComponent(
                    socio.codigo
            );
            /* INFORMACIÓN */

            infoNombre.textContent =
                socio.nombre;

            infoEmail.textContent =
                socio.email;

            infoCodigo.textContent =
                socio.codigo;

            infoEstado.textContent =
                socio.activo
                    ? "ACTIVO"
                    : "INACTIVO";


            /* SUBIR AL INICIO */

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            formSocio.reset();

            previewSocio.src = "";

            previewSocio.classList.add("oculto");


        } catch (error) {

            console.error(error);


            estadoSocio.className =
                "estado error";


            estadoSocio.textContent =
                error.message;

        }

    }
);


/* =========================
   BUSCAR PERSONA
========================= */

formBusqueda.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const codigo =
            codigoInput.value.trim();


        if (!codigo) {
            return;
        }


        estado.className =
            "estado";


        estado.textContent =
            "Buscando persona...";


        resultado.classList.add(
            "oculto"
        );


        try {

            const respuesta =
                await fetch(
                    API +
                    "/api/personas/" +
                    encodeURIComponent(codigo)
                );


            const datos =
                await respuesta.json();


            if (
                !respuesta.ok ||
                !datos.correcto
            ) {

                throw new Error(
                    datos.error ||
                    "Persona no encontrada."
                );

            }


            personaActual =
                datos.persona;


            mostrarBienvenida(
                personaActual
            );


            estado.className =
                "estado correcto";


            estado.textContent =
                "Persona encontrada correctamente.";


        } catch (error) {

            console.error(error);


            personaActual = null;


            estado.className =
                "estado error";


            estado.textContent =
                "No encontramos una persona con ese código.";

        }

    }
);

/* =========================
   MOSTRAR BIENVENIDA
========================= */

function mostrarBienvenida(persona) {

    /* OCULTAR TODAS LAS OTRAS SECCIONES */

    presentacion.classList.add(
        "oculto"
    );

    seccionBusqueda.classList.add(
        "oculto"
    );

    seccionSocio.classList.add(
        "oculto"
    );

    resultado.classList.add(
        "oculto"
    );


    /* MOSTRAR BIENVENIDA */

    seccionBienvenida.classList.remove(
        "oculto"
    );


    /* SALUDO */

    bienvenidaNombre.textContent =
        "Hola, " + persona.nombre + " 👋";


    /* CARGAR CARNET */

    carnetSocio.src =
        API +
        "/index.html?codigo=" +
        encodeURIComponent(
            persona.codigo
        );


    /* INFORMACIÓN */

    infoNombre.textContent =
        persona.nombre;

    infoEmail.textContent =
        persona.email;

    infoCodigo.textContent =
        persona.codigo;

    infoEstado.textContent =
        persona.activo
            ? "ACTIVO"
            : "INACTIVO";


    /* IR ARRIBA */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

    if (persona.tipo === "socio") {

    seccionBeneficios.classList.remove(
            "oculto"
        );

        cargarBeneficios();

    } else {

        seccionBeneficios.classList.add(
            "oculto"
        );

    }

}

/* =========================
   VER CARNET
========================= */

verCarnet.addEventListener(
    "click",
    () => {

        if (!personaActual) {
            return;
        }


        window.open(
            API +
            "/index.html?codigo=" +
            encodeURIComponent(
                personaActual.codigo
            ),
            "_blank"
        );

        }
);

async function cargarBeneficios() {

    try {

        const respuesta =
            await fetch(
                API + "/api/beneficios"
            );


        const datos =
            await respuesta.json();


        if (!datos.correcto) {
            return;
        }


        listaBeneficios.innerHTML = "";


        if (datos.beneficios.length === 0) {

            listaBeneficios.innerHTML = `
                <p class="sin-beneficios">
                    Actualmente no hay beneficios disponibles.
                </p>
            `;

            return;

        }


        datos.beneficios.forEach(
            beneficio => {

                const tarjeta =
                    document.createElement(
                        "article"
                    );


                tarjeta.className =
                    "beneficio";


                tarjeta.innerHTML = `

                    ${
                        beneficio.imagen
                            ? `
                            <img
                                src="${beneficio.imagen}"
                                class="beneficio-imagen"
                                alt=""
                            >
                            `
                            : ""
                    }


                    <div class="beneficio-contenido">

                        <h4>
                            ${beneficio.titulo}
                        </h4>

                        <p>
                            ${beneficio.descripcion}
                        </p>

                        ${
                            beneficio.enlace
                                ? `
                                <a
                                    href="${beneficio.enlace}"
                                    target="_blank"
                                    class="beneficio-enlace"
                                >
                                    VER BENEFICIO
                                </a>
                                `
                                : ""
                        }

                    </div>

                `;


                listaBeneficios.appendChild(
                    tarjeta
                );

            }
        );

    } catch (error) {

        console.error(
            "Error cargando beneficios:",
            error
        );

    }

}

/* =========================
   INICIO
========================= */

mostrarInicio();
