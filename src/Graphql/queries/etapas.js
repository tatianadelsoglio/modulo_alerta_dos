import { gql } from "@apollo/client";

export const GET_ETAPAS_SUMA = gql`
  query getEtapasSum(
    $idEstado: Int
    $fechaDesde: String
    $fechaHasta: String
    $idPipeline: Int
    $idUsuario: Int
    $tipoFecha: String
    $listadoEtiquetas: listaEtiquetas
    $usuarioFiltro: Int
    $idCliente: Int
  ) {
    getEtapasSumResolver(
      idEstado: $idEstado
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
      idPipeline: $idPipeline
      idUsuario: $idUsuario
      tipoFecha: $tipoFecha
      listadoEtiquetas: $listadoEtiquetas
      usuarioFiltro: $usuarioFiltro
      idCliente: $idCliente
    )
  }
`;

export const GET_ETAPA_POR_NEGOCIO = gql`
  query getEtapaById($idNegocio: Int) {
    getEtapaByNegocioResolver(idNegocio: $idNegocio) {
      eta_id
    }
  }
`;

export const GET_ETAPAS_POR_ID = gql`
  query getEtapaPorId($id: Int) {
    getEtapaPorIdResolver(id: $id) {
      eta_id
      eta_orden
      eta_nombre
      eta_avance
      eta_diasinactivos
    }
  }
`;

export const GET_PIPELINE_HEADER = gql`
  query getPipelineHeader($idUsuario: Int, $idEstado: Int) {
    getPipelineHeaderResolver(idUsuario: $idUsuario, idEstado: $idEstado)
  }
`;
