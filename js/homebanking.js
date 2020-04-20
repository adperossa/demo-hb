//Declaración de variables

let nombreUsuario = "Usuario no identificado"
let limiteExtraccion = 15000;
let saldoCuenta = 30000;
let estaAutenticado = false;
let menu = document.getElementById("menu");
let datosServicios = [
    {
        nombre: "Agua",
        costo: 350
    },
    {
        nombre: "Teléfono",
        costo: 425
    },
    {
        nombre: "Luz",
        costo: 210
    },
    {
        nombre: "Internet",
        costo: 570
    },
];
let agendaCuentas = [
    {
        nombre: "Amigo 1",
        codigo: 12345
    },
    {
        nombre: "Amigo 2",
        codigo: 67890
    },
];
let listaUsuarios = [
    {
        nombre: "Usuario A",
        clave: 1234
    },
    {
        nombre: "Usuario B",
        clave: 0000
    }
];

//Ejecución de las funciones que actualizan los valores de las variables en el HTML.
window.onload = function () {
    iniciarSesion();
    cargarNombreEnPantalla();
    actualizarSaldoEnPantalla();
    actualizarLimiteEnPantalla();
}

function tieneSaldoSuficiente(cantidad) {
    if (saldoCuenta < cantidad) {
        return false;
    } else {
        return true;
    }
}

function tieneLimiteSuficiente(cantidad) {
    if (limiteExtraccion < cantidad) {
        return false;
    } else {
        return true;
    }
}


function cambiarLimiteDeExtraccion(monto) {
    if (!monto) return;

    limiteExtraccion = monto;
    actualizarLimiteEnPantalla();

    alert(`El nuevo límite de extracción es: $${limiteExtraccion}`);

}

function extraerDinero(monto) {
    if (!monto) return false;

    if (!tieneSaldoSuficiente(monto)) { // chequea saldo
        alert("El saldo es insuficiente para realizar esta operación.");
        return false;
    }

    if (!tieneLimiteSuficiente(monto)) { // chequea limite de extracc
        alert("El monto de la operación supera su límite de extracción.");
        return false;
    }

    if (monto % 100 !== 0) {
        alert("Disculpe, este cajero sólo dispone de billetes de $100. Compruebe el monto a extraer.");
        return false;
    }

    let saldoAnterior = saldoCuenta;
    saldoCuenta -= monto;
    actualizarSaldoEnPantalla();

    alert(`Saldo anterior: $${saldoAnterior}
Monto a extraer: $${monto}
El saldo actualizado es: $${saldoCuenta} `);

}

function depositarDinero(monto) {
    if (!monto) return;

    let saldoAnterior = saldoCuenta;
    saldoCuenta += monto;
    actualizarSaldoEnPantalla();

    alert(`Saldo anterior: $${saldoAnterior}
Monto a depositar: $${monto}
El saldo actualizado es: $${saldoCuenta} `);

}

function pagarServicio() {
    if (!datosServicios.length) {
        alert("No hay servicios disponibles para pagar.");
        return false;
    }

    let mensajeServiciosDisp = "";
    for (let i = 0; i < datosServicios.length; i++) {
        mensajeServiciosDisp += (i+1) + " - ";
        mensajeServiciosDisp += datosServicios[i].nombre;
        mensajeServiciosDisp += "\n";
    }

    let inputServicio = parseInt(prompt(mensajeServiciosDisp)); // valida seleccion del servicio
    if (isNaN(inputServicio) || inputServicio < 1 || inputServicio > datosServicios.length) {
        alert("Opción inválida. Por favor elija el servicio a pagar indicándolo con su número.");
        return false;
    }

    let servicioAPagar = datosServicios[inputServicio - 1]; // selecciono el objeto apropiado de todo el array de servicios

    if (!tieneSaldoSuficiente(servicioAPagar.costo)) { // chequea saldo
        alert("Saldo insuficiente para pagar este servicio.");
        return false;
    }

    let saldoAnterior = saldoCuenta;
    saldoCuenta -= servicioAPagar.costo; // paga el servicio
    actualizarSaldoEnPantalla();

    alert(`Ha pagado el servicio ${servicioAPagar.nombre}
Saldo anterior: $${saldoAnterior}
Monto pagado: $${servicioAPagar.costo}
El saldo actualizado es: $${saldoCuenta}`)

    datosServicios.splice(inputServicio - 1, 1); // elimina el servicio pagado de los disponibles
}

function transferirDinero() {
    let monto = obtenerCantidad("Ingrese el monto a transferir:");
    if (!monto) return false;

    if (!tieneSaldoSuficiente(monto)) { //chequea saldo
        alert("Saldo insuficiente, no se puede realizar transferencia.");
        return false;
    }

    let inputDestinatario = parseInt(prompt("Ingrese el numero de cuenta del destinatario:"));
    let destinatario;
    let esCuentaAgendada = false; //chequear si el codigo ingresado existe en la agenda
    
    for (let i = 0; i < agendaCuentas.length; i++) {
        if (agendaCuentas[i].codigo === inputDestinatario) {
            esCuentaAgendada = true;
            destinatario = agendaCuentas[i];
            break;
        }
    }
    if (!esCuentaAgendada) {
        alert("El numero de cuenta ingresado no corresponde con un destinatario en agenda.");
        return false;
    }

    saldoCuenta -= monto;
    actualizarSaldoEnPantalla();

    alert(`Se han transferido: $${monto}
Cuenta destino: ${destinatario.codigo}
A nombre de: ${destinatario.nombre} `);

}

function iniciarSesion() {
    let inputClave = parseInt(prompt("Ingrese su clave de usuario:"));
    let usuario;

    for (let i = 0; i < listaUsuarios.length; i++) {
        if (listaUsuarios[i].clave === inputClave) {
            usuario = listaUsuarios[i];
            estaAutenticado = true;
        }

        if (estaAutenticado) break;
    }

    if (!estaAutenticado) {
        alert("Clave incorrecta, no se encontró un usuario asociado.\nEl sistema se bloqueó por seguridad.");
        saldoCuenta = 0;
        limiteExtraccion = 0;
        return false;
    }

    alert("Bienvenido/a, " + usuario.nombre);
    nombreUsuario = usuario.nombre;
}



function obtenerCantidad(texto) {
    let inputCliente = parseInt(prompt(texto));
    if (isNaN(inputCliente) || inputCliente <= 0) {
        alert("El monto a ingresar debe ser una cifra mayor a cero");
        return false;
    } else {
        return inputCliente;
    }
}

//Funciones que actualizan el valor de las variables en el HTML
function cargarNombreEnPantalla() {
    document.getElementById("nombre").innerHTML = "Bienvenido/a " + nombreUsuario;
}

function actualizarSaldoEnPantalla() {
    document.getElementById("saldo-cuenta").innerHTML = "$" + saldoCuenta;
}

function actualizarLimiteEnPantalla() {
    document.getElementById("limite-extraccion").innerHTML = "$" + limiteExtraccion;
}


//DOM Y EVENTOS

menu.addEventListener("click", function (e) {
    let target = e.target;
    let monto = "";

    if (!estaAutenticado) {
        alert("Usuario no autenticado. Por favor recargue e inicie sesión.");
        return false;
    }

    switch (target.id) {
        case "extraer-dinero":
            monto = obtenerCantidad("Ingrese la cantidad a extraer:");
            extraerDinero(monto);
            break;

        case "depositar-dinero":
            monto = obtenerCantidad("Ingrese la cantidad a depositar:");
            depositarDinero(monto);
            break;

        case "transferir-dinero":
            transferirDinero();
            break;

        case "pagar-servicios":
            pagarServicio();
            break;

        case "cambiar-limite":
            monto = obtenerCantidad("Ingrese el nuevo límite de extracción:");
            cambiarLimiteDeExtraccion(monto);
            break;

        default:
            console.warn("Error: el handler detecto click en elemento desconocido")
            break;
    }
})