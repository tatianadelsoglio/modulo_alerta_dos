import { gql } from "@apollo/client";

export const NEW_ETAPA_POR_NEGOCIO = gql`
  mutation newEtapaxNegocio($input: etapaxNegocioInput) {
    newEtapaxNegocioResolver(input: $input)
  }
`;

export const UPDATE_ETAPA_POR_NEGOCIO = gql`
  mutation updateEtapaxNegocio($input: etapaxNegocioInput) {
    updateEtapaxNegocioResolver(input: $input)
  }
`;

export const NEW_ETAPAS_POR_EMBUDO = gql`
  mutation newEtapaPipeline($input: etapasInput) {
    newEtapaPipelineResolver(input: $input)
  }
`;

export const UPDATE_NOMBRE_ETAPA = gql`
  mutation updateNombreEtapa(
    $idEtapa: Int
    $nombreEtapa: String
    $porcentajeEtapa: Int
    $diasInactivos: Int
  ) {
    updateNombreEtapaResolver(
      idEtapa: $idEtapa
      nombreEtapa: $nombreEtapa
      porcentajeEtapa: $porcentajeEtapa
      diasInactivos: $diasInactivos
    )
  }
`;

export const DELETE_ETAPA = gql`
  mutation deleteEtapa($idEtapa: Int) {
    deleteEtapaResolver(idEtapa: $idEtapa)
  }
`;
