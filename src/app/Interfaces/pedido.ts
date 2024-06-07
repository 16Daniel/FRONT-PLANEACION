import { DiasEspecial } from "./DiasEspecial";

export interface Pedido 
{
    id:number;
    idSucursal:string;
    codProveedor: number;
    fechaEntrega: Date;
    total: number;
    articulos:ArticuloPedido[];
    nombreproveedor:string;
    nombresucursal:string;
    status:number;
    rfc:string;
}

export interface PedidoH 
{
    id:number;
    idSucursal:string;
    codProveedor: number;
    fechapedido: Date;
    fechaEntrega: Date;
    total: number;
    articulos:ArticuloPedido[];
    nombreproveedor:string;
    nombresucursal:string;
    status:number;
    rfc:string;
    numpedido:string; 
    notificado:boolean; 
}

export interface ArticuloPedido 
{
    codArticulo: number;
        nombre: string;
        inventariohoy: number;
        precio: number;
        numlinea: number;
        cajas: number;
        unidadescaja: number;
        unidadestotales: number;
        tipoImpuesto: number;
        iva: number;
        total_linea: number;
        codigoAlmacen: string;
        tienemultiplo: boolean;
        hayinventario: boolean;

        consumospromedios:ConsumoModel[];
        consumomayor:number;
        factorseguridad:number;
        arraycalendario:number[];
        diasespeciales:DiasEspecial[]; 
}

export interface ConsumoModel
{
    dia:number
    consumo:number
}