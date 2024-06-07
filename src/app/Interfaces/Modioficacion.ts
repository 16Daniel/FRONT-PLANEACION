export interface Modioficacion 
{
    id:number,
    modificacion:string;
    valAntes: string;
    valDespues: string;
    justificacion: string;
    fecha: Date;
    idusuario: number;
    idPedido: number;
    enviado: boolean;
    pedidoSerie: string;
    numpedido: number;
    codarticulo: number;
 }
