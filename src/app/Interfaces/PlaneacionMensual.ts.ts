export interface ResultadoPedidoMensual {
    ubicacion: string;
    referencia: string;
    descripcion: string;
    consumoPromedio: number;
    desviacionEstandar: number;
    nivelObjetivo: number;
    stockFisico: number;
    pedidoSugerido: number;
    nombreprov:string; 
    idSucursal:number; 
    codProveedor:number
    udscaja:number; 
    precio:number; 
    tipoimpuesto:number; 
    iva:number; 
    codarticulo:number;
    idcab:number; 
    numpedidoLin:number; 
    numpedido:string; 
    fechaEntrega:Date; 
}

export interface ResultadoPedidoMensualGrupo {
     id:number; 
     idSucursal:number;
     codProveedor:number;
     items:ResultadoPedidoMensual[]; 
     estatus:string; 
     fecha:Date; 
     division:number; 
}

export interface divisionPedido
{
    codprov:number; 
    nomprov:string; 
    division:number; 
}

export interface GrupoPedido {
  numPedidoLin: number;
  items: ResultadoPedidoMensual[];
}