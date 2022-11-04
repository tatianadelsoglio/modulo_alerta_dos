export const permisos = (grupos) => {
  const autorizado = grupos.find((element) => element === 1);

  if (autorizado === 1) {
    return true;
  } else {
    return false;
  }
};
