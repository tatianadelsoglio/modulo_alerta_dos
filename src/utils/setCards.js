let cardList = [];
export const cardFormat = (resolver, idEstado) => {
	resolver.map((card) => {
		const c = {
			...card,
			layoutPosition: {
				x: card.eta_orden - 1,
				y: 0,
				w: 1,
				h: 4,
				minW: 1,
				maxW: 1,
				static: idEstado !== 0 ? true : false,
			},
			idEstado,
		};

		cardList.push(c);
	});
	return cardList;
};
