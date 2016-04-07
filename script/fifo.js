var tiempoGlobal = 0;
var colaListos = new Cola();
var colaBloqueados = new Cola();
var colaTerminados = new Cola();


setInterval(function(){

    tiempoGlobal += 1;
    actualizar();

},1000);


function actualizar(){

    $("#tiempo-global").html();
    $("#tiempo-global").html(tiempoGlobal);

    function pintarCola(cola){
        if(!cola.estaVacia()){

        }
    }


}

function CPU(){
    this.proceso = undefined;
    this.estaOcupado = function(){
        if(this.proceso == undefined){
            return false;
        }
        return true;
    };

    this.ejecutar = function(proceso){
        this.proceso = proceso;
    }

}


function Nodo(nombre,hijo) {

    this.hijo = hijo;
    this.nombre = nombre;
    this.proceso = new Proceso();

}

function Proceso() {
     this.rafaga = Math.floor((Math.random() * 10) + 2);;
     this.tiempoLlegada = tiempoGlobal;
     this.tiempoTerminado = undefined;
     this.tiempoRetorno = undefined;
     this.tiempoEspera = undefined;
     this.tiempoComienzo = undefined;

     this.setTiempoLlegada = function(tiempo){
         this.tiempoLlegada = tiempo;
     }

}

function Cola() {

    this.insertar = function (nodoNuevo) {

        if (this.nodoRaiz == undefined) {
            this.nodoRaiz = nodoNuevo;
        } else {
            this.insertarNodoLoco(this.nodoRaiz, nodoNuevo);

        }
        return true;
    };

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