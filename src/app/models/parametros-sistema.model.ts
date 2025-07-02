export interface ParametrosSistema {
    parametro_id: number;
    currency_default: string;
    days_in_year: number;
    vat_rate: number;
    income_tax_rate: number;
    tasa_descuento_referencial?: number;
    fecha_configuracion?: string;
}
