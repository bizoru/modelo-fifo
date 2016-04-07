var nAtendidos = 0;
var ColaLis;
var ColaTer;
var CantidadProcesos;
var bloqueado;
var sumaTiempos;
var estadosArr;
var gant, canvas, ctx;
var tiempoespera = 0;
var tespera;
var tll;


$(document).ready(function () {

    canvas = document.getElementById("gantt");
    ctx = canvas.getContext("2d");
    bloqueado = false;

    CantidadProcesos = 5;
    $("#gant").attr("height", 23 * CantidadProcesos);
    $("#contenedor").height(400 + (CantidadProcesos * 32));
    $("#contenedor2").height(100 + (CantidadProcesos * 23));
    $(".columna").height(20 + (CantidadProcesos * 35));

    ColaLis = new cola();
    ColaTer = new cola();

    LlenarCola(CantidadProcesos);
    Crearbloqueo();
    fifo();

});

function LlenarCola(procesos) {
    estadosArr = new Array(CantidadProcesos);
    tespera = 0;
    tll = 0;
    for (var i = 0; i < procesos; i++) {
        sumaTiempos = 0;
        var ID = i + 1;
        var T = Math.floor((Math.random() * 4) + 8);
        sumaTiempos += T;

        var R = Math.floor(Math.random() * 4);
        var E = "Nuevo";

        estadosArr[i] = E;
        ColaLis.insertarUltimo(ID, T, T, tll, tespera, R, E);
        tespera += T;
    }
    DiagramarCola("listos");
}


function Crearbloqueo() {
    gant = new Array(CantidadProcesos);
    for (var i = 0; i < CantidadProcesos; i++) {
        gant[i] = [];
        for (var j = 0; j < CantidadProcesos; j++) {
            gant[i].push(i);
        }
    }
    console.log(gant);
}

function fifo() {
    var Tiempo0 = true;
    var TiempoT = true;
    var nodo;
    var clock = 0;

    setInterval(function () {
        $("#reloj").html("Sección Crítica: " + clock + " Milisegundos");
        clock = Math.round((clock + 0.1) * 10) / 10;

        if (Tiempo0) {
            if (!ColaLis.vacia()) {
                nodo = ColaLis.extraerPrimero();
                DiagramarCola("listos");
                TransicionDibujo(nodo, 1);
                nodo.estado = "Critico";
                estadosArr[nodo.proceso - 1] = nodo.estado;
                mensaje(nodo, 0);
                DiagramarProceso(nodo);
                Tiempo0 = false;
                TiempoT = true;
                tiempoespera += nodo.tiempo;
            }
        }

        if (TiempoT) {
            if (nodo.tiempo > 0) {
                nodo.tiempo = Math.round((nodo.tiempo - 0.1) * 10) / 10;
                DiagramarProceso(nodo);
                DiagramarGant(nodo.proceso - 1);

            } else {
                nodo.estado = "Terminado";
                estadosArr[nodo.proceso - 1] = nodo.estado;
                ColaTer.insertarUltimo(nodo.proceso, nodo.tiempo, nodo.rafaga, nodo.ll, nodo.es, nodo.recurso, nodo.estado);
                mensaje(nodo, 1);
                DiagramarProceso(null);
                DiagramarCola(3);
                TiempoT = false;
                Tiempo0 = true;
                nAtendidos++;
            }
        }

    }, 100);
}


function DiagramarCola(nombre) {

    textoCola = ".lista"+nombre;
    var cola;

    if(nombre == "listos"){
        cola = ColaLis;
    }
    if(nombre == "terminados"){
        cola = ColaTer;
    }

    while (!cola.vacia()) {
        var text = "";
        var textoCola = "";
        var nodo;
        nodo = cola.extraerPrimero();
        text += "<li style='background-color: " + nodo.color + "'><p>proceso " + nodo.proceso + " <br> rafaga " + nodo.rafaga + " llegada " + nodo.ll + " espera " + nodo.es + "</p></li>";
    }

    $(textoCola).html(text);
}


function TransicionDibujo(nodo, n) {
    $("#anim").html("proceso " + nodo.proceso);
    if (n == 1) {
        var w = $(window).width();
        var h = $(window).height();
        var w1 = (w * 0.41) + "px";
        $("#proceso").animate({opacity: '0'}, 400);
        $("#anim").animate({opacity: '1'}, 0);
        $("#anim").offset({top: h * 0.4, left: w * 0.1});
        $("#anim").animate({left: w1, top: '140px', width: '260px'}, 300);
        $("#anim").animate({opacity: '0'}, 200);
        $("#proceso").animate({opacity: '1'}, 0);
    }
}


function DiagramarProceso(nodo) { //Este si va
    var text = "";
    if (nodo != null) {
        text += "<p>proceso " + nodo.proceso;
        text += "<p>Tiempo de Ejecución:" + nodo.tiempo;
    } else {
        $("#proceso").animate({opacity: '0'}, 100);
    }
    $("#proceso").html(text);
}


function DiagramarGant(n) {
    ctx.fillStyle = "#5353FF";
    ctx.font = "20px Arial";
    for (i = 0; i < CantidadProcesos; i++) {
        if (i == n) {
            gant[i].push(1);
        } else {
            gant[i].push(0);
        }
        ctx.fillText("proceso" + (i + 1), 10, 22 * (i + 1));
    }
    for (i = 0; i < CantidadProcesos; i++) {
        var ultimo = gant[i].length - 1;
        if (gant[i][ultimo] == 1) {
            ctx.fillStyle = "#40FF00";
            ctx.fillRect(100 + Math.round(gant[i].length / (CantidadProcesos * 0.1)), 5 + (22 * i), 1, 20);
        } else {
            if (estadosArr[i] == "Nuevo") {
                ctx.fillStyle = "#8258FA";
                ctx.fillRect(100 + Math.round(gant[i].length / (CantidadProcesos * 0.1)), 5 + (22 * i), 1, 20);
            }
            if (estadosArr[i] == "Terminado") {
                ctx.fillStyle = "#58D3F7";
                ctx.fillRect(100 + Math.round(gant[i].length / (CantidadProcesos * 0.1)), 5 + (22 * i), 1, 20);
            }
            if (estadosArr[i] == "Listo") {
                ctx.fillStyle = "#220A29";
                ctx.fillRect(100 + Math.round(gant[i].length / (CantidadProcesos * 0.1)), 5 + (22 * i), 1, 20);
            }
        }
    }

}

function mensaje(p, r) {
    var text = "Proceso " + p.proceso + ": ";
    if (r == 1) {
        $("#respuesta").html("<p>" + text + "</p>");
        $("#respuesta").show();
        $("#respuesta").fadeOut(4000, function () {
        });
    }
}


