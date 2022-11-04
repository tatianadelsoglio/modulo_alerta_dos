

export const compare = (a, b) => {
    const stepA = a.eta_orden;
    const stepB = b.eta_orden;

    let comparison = 0;
    if (stepA > stepB) {
        comparison = 1;
    } else if (stepA < stepB) {
        comparison = -1;
    }
    return comparison;


};
