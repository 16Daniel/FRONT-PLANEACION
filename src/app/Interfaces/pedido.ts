import { DiasEspecial, DiasEspecialSuc } from "./DiasEspecial";

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
    tieneretornables:boolean; 
    cartones:number;
    capturacartones:boolean; 
    tienedescuento:boolean|undefined; 
    cantidaddescuento:number|undefined; 

    cartonesplaneacion:number|undefined;
    diferenciacartones:number|undefined; 

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
    tienedescuento:boolean|undefined; 
    cantidaddescuento:number|undefined; 
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
        diasespeciales:DiasEspecialSuc[]; 

        calendarioespecial:boolean;
        unidadesextra:number;
        esretornable:boolean; 

        tienelimitealmacen:boolean;
        capacidadalmfinal:number; 

}

export interface ConsumoModel
{
    dia:number
    consumo:number
}

export interface ArticuloPedSuc {
    codArticulo: number;
    nombre: string;
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
  }

  export interface PedidoSuc {
    id: number;
    idSucursal: string;
    nombresucursal: string;
    nombreproveedor: string;
    codProveedor: number;
    fecha:Date; 
    fechaEntrega: Date;
    total: number;
    status: number;
    rfc: string;
    articulos: ArticuloPedSuc[];
    nombresolicitante: string;

    tienedescuento:boolean|undefined; 
    cantidaddescuento:number|undefined; 
    numpedido:string|undefined; 
  }
