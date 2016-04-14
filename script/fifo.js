var tiempoGlobal = 0;
var colaListos = new Cola();
var colaBloqueados = new Cola();
var colaTerminados = new Cola();
var cpu = new CPU();
var despachador = new Despachador();

iniciar();


function iniciar() {

    for (var i = 0; i < 10; i++) {
        colaListos.insertar(new Nodo("proceso " + i));
    }

    function reloj() {
        setInterval(function () {
            tiempoGlobal += 1;
            actualizar();

        }, 1000);
    }

    reloj();


}

function actualizar() {

    $("#tiempo-global").html();
    $("#tiempo-global").html(tiempoGlobal);
    pintarCola(colaListos, ".lista-listos");
    pintarCola(colaBloqueados, ".lista-bloqueados");
    pintarCola(colaTerminados, ".lista-terminados");
    pintarCPU('.lista-cpu');
    despachador.despachar();


}

function Despachador() {

    this.despachar = function () {
        // Manejo de la cola de bloqueados

        // Si la cpu esta libre asignar el primer proceso disponible de la cola de listos
        if (!cpu.estaOcupado()) {
            if (!colaListos.estaVacia()) {
                cpu.ejecutar(colaListos.remover());
            }
        } else {
            if (cpu.nodo.proceso.tiempoEjecucionRestante == 0) {
                colaTerminados.insertar(cpu.liberar());
            } else {
                cpu.nodo.proceso.tiempoEjecucionRestante -= 1;
            }
        }
        // Proceso disponible en la cola de bloqueados
    };


}


function pintarCPU(selectorHtml) {

    $(selectorHtml).html("");
    if (cpu.estaOcupado()) {
        pintarNodoSimple(cpu.nodo, selectorHtml);
    } else {
        cpuVacio(selectorHtml);
    }

}

function pintarCola(cola, selectorHtml) {

    var colaAux = Object.create(cola);

    if (cola.cambiado) {
        $(selectorHtml).html("");
        if (!cola.estaVacia()) {
            if (cola.traerRaiz()) {
                pintarNodo(cola.traerRaiz(), selectorHtml);
            }
        } else {
            vacio(selectorHtml);
        }
    }
}

function pintarNodo(nodo, selectorHtml) {

    pintarNodoSimple(nodo, selectorHtml);
    if (nodo.hijo) {
        pintarNodo(nodo.hijo, selectorHtml);
    }
    return;
}

function pintarNodoSimple(nodo, selectorHtml) {

    $(selectorHtml).prepend(procesoHTML(nodo.proceso));
}

function procesoHTML(proceso) {
    var html = "<li><div>" +
        "<p>" + proceso.nombre + "</p>" +
        "<p>Tiempo rafaga: <b>" + proceso.rafaga + "</b></p>" +
        "<p>Tiempo Restante Ejecucion " + proceso.tiempoEjecucionRestante + "</p>" +
        "<p>Tiempo Bloqueo " + proceso.tiempoBloqueo + "</p>" +
        "<p>Tiempo Llegada " + proceso.tiempoLlegada + "</p>" +
        "</div></li>";
    return html;
}

function vacio(selectorHtml) {
    var html = "<li class='vacio'><div>" +
        "<p> Cola Vacia</p>" +
        "</div></li>";
    $(selectorHtml).html(html);
}

function cpuVacio(selectorHtml) {
    var html = "<li class='vacio'><div>" +
        "<p> CPU Disponible </p>" +
        "</div></li>";
    $(selectorHtml).html(html);
}

function CPU() {

    this.nodo = undefined;
    this.estaOcupado = function () {
        if (this.nodo == undefined) {
            return false;
        }
        return true;
    };

    this.ejecutar = function (nodo) {
        this.nodo = nodo;
    }

    this.liberar = function () {
        if (this.nodo) {
            var n = this.nodo;
            n.hijo = undefined;
            this.nodo = undefined;
            return n;
        }
        return undefined;
    }

}


function Nodo(nombre, hijo) {

    this.hijo = hijo;
    this.proceso = new Proceso(nombre);

}

function Proceso(nombre) {
    this.nombre = nombre;
    this.rafaga = Math.floor((Math.random() * 10) + 2);
    this.tiempoEjecucionRestante = this.rafaga;
    this.tiempoBloqueo = 0;
    this.tiempoLlegada = tiempoGlobal;
    this.tiempoTerminado = undefined;
    this.tiempoRetorno = undefined;
    this.tiempoEspera = undefined;
    this.tiempoComienzo = undefined;

    this.setTiempoLlegada = function (tiempo) {
        this.tiempoLlegada = tiempo;
    }

}

function Cola() {

    this.cambiado = true;

    this.insertar = function (nodoNuevo) {

        if (this.nodoRaiz == undefined) {
            this.nodoRaiz = nodoNuevo;
            this.cambiado = true;
        } else {
            this.insertarNodoLoco(this.nodoRaiz, nodoNuevo);

        }
        return true;
    };

    this.traerRaiz = function () {
        if (this.nodoRaiz) {
            return this.nodoRaiz;
            this.cambiado = true;
        }
        return undefined;
    }

    this.insertarNodoLoco = function (nodo1, nodo2) {
        if (nodo1.hijo == undefined) {
            nodo1.hijo = nodo2;

        } else {
            this.insertarNodoLoco(nodo1.hijo, nodo2);
        }

    };

    this.remover = function () {

        if (this.nodoRaiz != undefined) {
            var nodo = this.nodoRaiz;

            if (this.nodoRaiz.hijo == undefined) {
                this.nodoRaiz = undefined;
            } else {
                this.nodoRaiz = this.nodoRaiz.hijo;
            }

            return nodo;
        }
    };

    this.estaVacia = function () {

        if (this.nodoRaiz == undefined) {
            return true;
        }
        return false;
    }
}