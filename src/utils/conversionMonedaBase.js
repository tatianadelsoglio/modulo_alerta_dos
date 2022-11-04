export function conversionMonedaBase(monedaBase, monedaNegocio, valorNegocio, cotizacionDolar, cotizacionReal) {
	// si la moneda base es igual a la moneda del negocio retorna el valor del negocio

	if (monedaBase === monedaNegocio) {
		return valorNegocio;
	}
	// Si la moneda base es pesos
	if (monedaBase === 1) {
		switch (monedaNegocio) {
			// el negocio está expresado en dólares
			case 2:
				return valorNegocio * cotizacionDolar;
			//el negocio esta expresado en real
			case 3:
				return valorNegocio * cotizacionReal;

			default:
				break;
		}
	}
	// si la moneda base es dolar y el valor del negocio es $AR
	if (monedaBase === 2) {
		switch (monedaNegocio) {
			// el negocio está expresado en dólares
			case 1:
				return valorNegocio / cotizacionDolar;
			//el negocio esta expresado en real
			case 3:
				return (valorNegocio * cotizacionReal) / cotizacionDolar;

			default:
				break;
		}
	}
	// Si la moneda Base es Real y el Valor del negocio es $Dolar
	if (monedaBase === 3) {
		switch (monedaNegocio) {
			// el negocio está expresado en dólares
			case 1:
				return valorNegocio / cotizacionReal;
			//el negocio esta expresado en real
			case 2:
				return (valorNegocio * cotizacionDolar) / cotizacionReal;

			default:
				return '';
		}
	}
}
