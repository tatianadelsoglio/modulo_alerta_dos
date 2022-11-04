export const conversion = (from, to) => {
	//from: objeto que describe el valor y la moneda actual form{valor:1000, mon_origen:1}
	//to: objeto que describe el valor de conversión y divisa to{tasa:93,57, mon_destino:2}
	const { valor, mon_origen } = from;
	const { tasa, mon_destino } = to;

	let converted;

	switch (true) {
		case mon_origen === 1 && mon_destino === 2:
			converted = (Number(valor) / Number(tasa)).toLocaleString('de-DE', { maximumFractionDigits: 2 });
			break;
		case mon_origen === 2 && mon_destino === 1:
			converted = (Number(valor) * Number(tasa)).toLocaleString('de-DE', { maximumFractionDigits: 2 });
			break;

		default:
			break;
	}

	return converted;
};
