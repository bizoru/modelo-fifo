var tiempoGlobal = 0;
var colaListos = new Cola();
var colaBloqueados = new Cola();
var colaTerminados = new Cola();
var cpu = new CPU();
var despachador = new Despachador();
var usuario =  new usuario();
var gantt = new Gantt();

iniciar();


function iniciar() {

    function reloj() {
        setInterval(function () {
            tiempoGlobal += 1;
            actualizar();
            usuario.abrirProceso();

        }, 1000);
    }

    reloj();

}

function usuario(){
    this.nombresProcesos = ['Microsoft Word','Bloc de Notas','Microsoft PowerPoint','Virtualbox','Safari','Google Chrome','Firefox','DOS','Buscaminas','Netbeans','Microsoft Excel'];
    this.contador = 0;
    this.abrirProceso = function(){
         if(this.contador == 4){
             this.contador = 0;
             var nombre = this.nombresProcesos[Math.floor(Math.random()*this.nombresProcesos.length-1)+1];
             var nodo = new Nodo(nombre);
             nodo.proceso.preparado();
             gantt.registrarProceso(nodo.proceso);
             colaListos.insertar(nodo);
         }else{
             this.contador += 1;
         }
    };
}


function actualizar() {

    $("#tiempo-global").html();
    $("#tiempo-global").html(tiempoGlobal);
    pintarCola(colaListos, ".lista-listos");
    pintarCola(colaBloqueados, ".lista-bloqueados");
    pintarCola(colaTerminados, ".lista-terminados");
    pintarCPU('.lista-cpu');
    despachador.despachar();
    gantt.actualizarGraficos();


}

function Despachador() {

    this.despachar = function () {
        // Manejo de la cola de bloqueados
        if(!colaBloqueados.estaVacia()){
            var raiz = colaBloqueados.traerRaiz();
            if(raiz.proceso.tiempoBloqueo >0 ){
                raiz.proceso.tiempoBloqueo -= 1;
            }else{
                raiz = colaBloqueados.remover();
                raiz.hijo = undefined;
                colaListos.insertar(raiz);
            }
        }

        // Si la cpu esta libre asignar el primer proceso disponible de la cola de listos
        if (!cpu.estaOcupado()) {
            if (!colaListos.estaVacia()) {
                cpu.ejecutar(colaListos.remover());
            }
        } else {
            if (cpu.nodo.proceso.tiempoEjecucionRestante == 0) {
                cpu.nodo.proceso.tiempoTerminado = tiempoGlobal;
                var nodo = cpu.liberar();
                nodo.proceso.terminado();
                colaTerminados.insertar(nodo);
            } else {
                cpu.nodo.proceso.tiempoEjecucionRestante -= 1;
                if(debeBloquear()){
                    cpu.nodo.proceso.bloqueado();
                    cpu.nodo.proceso.tiempoBloqueo = Math.floor(Math.random()*7)+1;
                    colaBloqueados.insertar(cpu.liberar());
                }

            }
        }
    };


}

function debeBloquear(){
    if(Math.floor(Math.random()*8)+1 == 3 || Math.floor(Math.random()*8)+1 == 1){
          return true;
    }
    return false;
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

    var mensajeBloqueo = "";
    var mensajeTiempoRestante = "";
    var mensajeTiempoTerminado = "";
    var mensajeTiempoLlegada = "<p>Tiempo Llegada " + proceso.tiempoLlegada + "</p>";
    var id = "<p>Id: <b>"+proceso.id+"</b></p>";

    if(proceso.tiempoBloqueo > 0){
        mensajeBloqueo = "<p>Tiempo Bloqueo <b>" + proceso.tiempoBloqueo + "</b></p>";
        mensajeTiempoLlegada = "";
    }
    if(proceso.tiempoEjecucionRestante > 0){
        mensajeTiempoRestante = "<p>Tiempo Restante Ejecucion <b>" + proceso.tiempoEjecucionRestante + "</b></p>";
    }
    if(proceso.tiempoTerminado != undefined){
        var tiempoTotal = proceso.tiempoTerminado - proceso.tiempoLlegada;
        mensajeTiempoTerminado = "<p>Tiempo Terminado <b>" + proceso.tiempoTerminado + "</b> Total: "+ tiempoTotal+"</p>";
    }

    var html = "<li><div>" +
        "<p><b>" + proceso.nombre + "</p></b>" +
        "<p>Tiempo Rafaga: <b>" + proceso.rafaga + "</b></p>" +
        mensajeTiempoRestante+
        mensajeBloqueo+
        mensajeTiempoLlegada +
            mensajeTiempoTerminado+
            id+
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
        this.nodo.proceso.enEjecucion();
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
    this.id = createUUID();
    this.estado = undefined;
    this.nombre = nombre;
    this.rafaga = Math.floor((Math.random() * 10) + 2);
    this.tiempoEjecucionRestante = this.rafaga;
    this.tiempoBloqueo = 0;
    this.tiempoLlegada = tiempoGlobal;
    this.tiempoTerminado = undefined;
    this.tiempoRetorno = undefined;
    this.tiempoEspera = undefined;
    this.tiempoComienzo = undefined;
    this.gantt = gantt;

    this.setTiempoLlegada = function (tiempo) {
        this.tiempoLlegada = tiempo;
    }

    this.enEjecucion = function(){
        this.estado = "ejecucion";
        this.gantt.actualizarEstadoProceso(this.id,this.estado);
    }

    this.bloqueado = function(){
        this.estado = "bloqueado";
        this.gantt.actualizarEstadoProceso(this.id,this.estado);
    }

    this.terminado = function(){
        this.estado = "terminado";
        this.gantt.actualizarEstadoProceso(this.id,this.estado);
    }

    this.preparado = function(){
        this.estado = "listo";
        this.gantt.actualizarEstadoProceso(this.id,this.estado);
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


function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}