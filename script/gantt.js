function Gantt(){

    this.procesos = {};

    this.registrarProceso = function(proceso){
        this.procesos[proceso.id] = {'estado': proceso.estado, 'nombre': proceso.nombre, 'id': proceso.id};
        this.procesos[proceso.id]['cambio'] = true;
    };

    this.actualizarEstadoProceso = function(id,estado){
        if(this.procesos[id]){
            this.procesos[id]['estado'] = estado;
            this.procesos[id]['cambio'] = true;
        }
    };

    this.actualizarGraficos = function () {

        for(proceso in this.procesos){
            var progressBar ="";

            if(this.procesos[proceso]['estado'] == "listo"){
                progressBar = " <div class='progress-bar progress-bar-listo' role='progressbar'></div>";
            }
            if(this.procesos[proceso]['estado'] == "ejecucion"){
                progressBar = " <div class='progress-bar progress-bar-ejecucion' role='progressbar'></div>";
            }
            if(this.procesos[proceso]['estado'] == "terminado"){
                progressBar = " <div class='progress-bar progress-bar-terminado' role='progressbar'></div>";
            }
            if(this.procesos[proceso]['estado'] == "bloqueado"){
                progressBar = " <div class='progress-bar progress-bar-bloqueado' role='progressbar'></div>";
            }
            if(this.procesos[proceso]['estado'] == "suspendido"){
                progressBar = " <div class='progress-bar progress-bar-suspendido' role='progressbar'></div>";
            }

            if(!$("#"+this.procesos[proceso]['id']).length){

                var html = "<div>"+ this.procesos[proceso]['nombre']+" <b>Id:</b> " +this.procesos[proceso]['id']+"</div><div id='"+this.procesos[proceso]['id']+"' class='progress'></div>";
                $("#procesos-gantt").append(html);
                $("#"+this.procesos[proceso]['id']).append(progressBar);


            }else{

                if(this.procesos[proceso]['estado'] != "terminado") {
                    $("#" + this.procesos[proceso]['id']).append(progressBar);
                }
            }

            var width = $("#"+this.procesos[proceso]['id']).contents().last("div").width();

            if(this.procesos[proceso]['estado'] != "terminado"){
                $("#"+this.procesos[proceso]['id']).contents().last("div").width((width+5).toString()+"px");
            }
        }


    }
}
