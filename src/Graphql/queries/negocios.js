import { gql } from "@apollo/client";
// Traer los negocios
export const GET_NEGOCIOS_POR_EMBUDO = gql`
  query getNegocios(
    $idPipeline: Int
    $idEstado: Int
    $fechaDesde: String
    $fechaHasta: String
    $idUsuario: Int
    $tipoFecha: String
    $listadoEtiquetas: listaEtiquetas
    $usuarioFiltro: Int
    $idCliente: Int
  ) {
    getNegocioResolver(
      idPipeline: $idPipeline
      idEstado: $idEstado
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
      idUsuario: $idUsuario
      tipoFecha: $tipoFecha
      listadoEtiquetas: $listadoEtiquetas
      usuarioFiltro: $usuarioFiltro
      idCliente: $idCliente
    )
  }
`;

export const GET_NEGOCIO_POR_ID = gql`
  query getNegociosById($idNegocio: Int) {
    getNegocioByIdResolver(idNegocio: $idNegocio)
  }
`;
