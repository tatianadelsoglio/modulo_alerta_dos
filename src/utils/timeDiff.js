export const timeDiff = (updateDate, previousDate) => {
	// Esta utilidad es sólo para timestamp
	const fp = new Date(Number(previousDate));
	const fu = new Date(Number(updateDate));

	return Math.floor((fu - fp) / (1000 * 60 * 60 * 24));
};
