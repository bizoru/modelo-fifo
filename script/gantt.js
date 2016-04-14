function Gantt(){

    this.procesos = {};

    this.registrarProceso = function(proceso){
        this.procesos[proceso.id] = {'estado': proceso.estado, 'nombre': proceso.nombre, 'id': proceso.id};
    }

    this.actualizarEstadoProceso = function(id,estado){
        if(this.procesos[id]){
            this.procesos[id]['estado'] = estado;
        }

    }
}

