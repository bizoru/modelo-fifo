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
    pintarCola(colaListos,".lista-listos");
    pintarCola(colaBloqueados,".lista-bloqueados");
    pintarCola(colaTerminados,".lista-terminados");


}

function pintarCola(cola,selectorHtml){

    if(cola.cambiado){
        $(selectorHtml).html("");
        if(!cola.estaVacia()){
            if(cola.traerRaiz()){
                pintarNodo(cola.traerRaiz(),selectorHtml);
            }
        }else{
            console.log("vacio!");
            vacio(selectorHtml);
        }
    }
    cola.cambiado = false;
}

function pintarNodo(nodo,selectorHtml){

  $(selectorHtml).prepend(procesoHTML(nodo.proceso));
  if(nodo.hijo){
     pintarNodo(nodo.hijo,selectorHtml);
  }
}

function procesoHTML(proceso){
    var html = "<li><div>"+
               "<p>"+proceso.nombre+"</p>"+
               "<p>Tiempo rafaga: <b>"+proceso.rafaga+"</b></p>"
               "</div></li>";
    return html;
}

function vacio(selectorHtml){
    var html = "<li class='vacio'><div>"+
        "<p> Cola Vacia</p>"+
        "</div></li>";
    $(selectorHtml).html(html);
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
    this.proceso = new Proceso(nombre);

}

function Proceso(nombre) {
     this.nombre = nombre;
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

    this.traerRaiz =  function(){
        if(this.nodoRaiz){
            return this.nodoRaiz;
            this.cambiado = true;
        }
        return undefined;
    }

    this.insertarNodoLoco = function (nodo1, nodo2) {
        if (nodo1.hijo == undefined) {
            nodo1.hijo = nodo2;
            this.cambiado = true;
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
            this.cambiado = true;
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