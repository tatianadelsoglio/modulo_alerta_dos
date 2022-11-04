/* eslint-disable array-callback-return */
export function maxValueScaleCalculate(data) {
  let values = [];
  // crea un array que suma los valores de abiertos y cerrados

  // pregunta si es mayor o menor que 10,20,30... etc.
  data.map((usuario) => {
    // recorre data extrayendo la suma de los negocios cerrados y abiertos.
    values.push(usuario.Abiertos + usuario.Cerrados);
  });
  // extrae el valor maximo del array

  let maxValue = calculate.maxValue(values);

  return calculate.maxScaleValue(maxValue);
}

// utilidades

const calculate = {
  maxValue: (arrayValues) => {
    let max = 0;
    for (let value of arrayValues) {
      // Evalúa si «max» es menor que «numero» para almacenar
      // en él el número más grande hasta el momento:
      if (max < value) max = value;
    }

    return max;
  },
  maxScaleValue: (maxValue) => {
    switch (true) {
      case maxValue <= 10:
        return 10;
      case maxValue <= 20:
        return 20;
      case maxValue <= 30:
        return 30;
      case maxValue <= 40:
        return 40;
      case maxValue <= 50:
        return 50;
      case maxValue <= 60:
        return 60;
      case maxValue <= 70:
        return 70;
      case maxValue <= 80:
        return 80;
      case maxValue <= 90:
        return 90;
      case maxValue <= 100:
        return 100;

      default:
        return "auto";
    }
  },
};
