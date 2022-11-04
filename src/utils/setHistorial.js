export const setHistorial = (
  newHistorialNegocioResolver,
  idUser,
  neg_id,
  eta_id,
  his_detalle,
  his_etaprevia
) => {
  const input = {
    neg_id,
    eta_id,
    his_detalle,
    usu_id: idUser,
    his_etaprevia,
  };

  newHistorialNegocioResolver({ variables: { input } }).then((item) => {});
};
