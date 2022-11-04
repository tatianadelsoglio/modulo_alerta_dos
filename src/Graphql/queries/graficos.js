import { gql } from "@apollo/client";

export const GET_GRAFICOS = gql`
  query getDataEmbudo(
    $idPipeline: Int
    $idUsuario: Int
    $idEstado: Int
    $fechaDesde: String
    $fechaHasta: String
    $tipoFecha: String
  ) {
    getDataEmbudoResolver(
      idPipeline: $idPipeline
      idUsuario: $idUsuario
      idEstado: $idEstado
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
      tipoFecha: $tipoFecha
    ) {
      porcentajeEtapa
      cantidadNegocios
      eta_id
      eta_nombre
      eta_avance
    }
  }
`;
export const GET_TORTA_ABIERTOS_CERRADOS = gql`
  query getTortaAbiertosCerrados(
    $idPipeline: Int
    $idUsuario: Int
    $tipoFecha: String
    $fechaDesde: String
    $fechaHasta: String
  ) {
    getTortaAbiertosCerradosResolver(
      idPipeline: $idPipeline
      idUsuario: $idUsuario
      tipoFecha: $tipoFecha
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
    )
  }
`;
export const GET_TORTA_GANADOS_PERDIDOS = gql`
  query getTortaGanadosPerdidos(
    $idPipeline: Int
    $idUsuario: Int
    $tipoFecha: String
    $fechaDesde: String
    $fechaHasta: String
  ) {
    getTortaGanadosPerdidosResolver(
      idPipeline: $idPipeline
      idUsuario: $idUsuario
      tipoFecha: $tipoFecha
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
    )
  }
`;

export const GET_BARRA_APILADA_ABIERTOS_CERRADOS = gql`
  query getBarraApiladaAbiertosCerrados(
    $idPipeline: Int
    $idUsuario: Int
    $tipoFecha: String
    $fechaDesde: String
    $fechaHasta: String
  ) {
    getBarraApiladaAbiertosCerradosResolver(
      idPipeline: $idPipeline
      idUsuario: $idUsuario
      tipoFecha: $tipoFecha
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
    )
  }
`;
export const GET_BARRA_APILADA_GANADOS_PERDIDOS = gql`
  query getBarraApiladaGanadosPerdidos(
    $idPipeline: Int
    $idUsuario: Int
    $tipoFecha: String
    $fechaDesde: String
    $fechaHasta: String
  ) {
    getBarraApiladaGanadosPerdidosResolver(
      idPipeline: $idPipeline
      idUsuario: $idUsuario
      tipoFecha: $tipoFecha
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
    )
  }
`;

export const GET_ALL_DATA_GRAFICOS = gql`
  query getDataAll(
    $idPipeline: Int
    $idUsuario: Int
    $tipoFecha: String
    $fechaDesde: String
    $fechaHasta: String
  ) {
    getDataAllGraficosResolver(
      idPipeline: $idPipeline
      idUsuario: $idUsuario
      tipoFecha: $tipoFecha
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
    )
  }
`;

export const GET_ALL_DATA_GRAFICOS_GANADOS_PERDIDOS = gql`
  query getDataAllGanadosPerdidos(
    $idPipeline: Int
    $idUsuario: Int
    $tipoFecha: String
    $fechaDesde: String
    $fechaHasta: String
  ) {
    getDataAllGraficosGanadosPerdidosResolver(
      idPipeline: $idPipeline
      idUsuario: $idUsuario
      tipoFecha: $tipoFecha
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
    )
  }
`;

//! dashboard analitico remastered
export const GET_G_BARRA_HORIZONTAL = gql`
  query getGBarraHorizontalResolver(
    $idPipeline: Int
    $fechaDesde: String
    $fechaHasta: String
    $tipoFecha: String
  ) {
    getGBarraHorizontalResolver(
      idPipeline: $idPipeline
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
      tipoFecha: $tipoFecha
    )
  }
`;

export const GET_G_TORTA_ACA = gql`
  query getGTortaACAResolver(
    $idPipeline: Int
    $fechaDesde: String
    $fechaHasta: String
    $tipoFecha: String
  ) {
    getGTortaACAResolver(
      idPipeline: $idPipeline
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
      tipoFecha: $tipoFecha
    )
  }
`;

export const GET_G_TORTA_PG = gql`
  query getGTortaPGResolver(
    $idPipeline: Int
    $fechaDesde: String
    $fechaHasta: String
    $tipoFecha: String
  ) {
    getGTortaPGResolver(
      idPipeline: $idPipeline
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
      tipoFecha: $tipoFecha
    )
  }
`;

export const GET_G_STACKED_ACA = gql`
  query getGStackedACAResolver($idPipeline: Int) {
    getGStackedACAResolver(idPipeline: $idPipeline)
  }
`;

export const GET_G_STACKED_PG = gql`
  query getGStackedPGResolver($idPipeline: Int) {
    getGStackedPGResolver(idPipeline: $idPipeline)
  }
`;

export const GET_G_FUNNEL = gql`
  query getGFunnelResolver($idPipeline: Int, $estado: String) {
    getGFunnelResolver(idPipeline: $idPipeline, estado: $estado)
  }
`;
