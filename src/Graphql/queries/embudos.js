import { gql } from "@apollo/client";

export const GET_EMBUDOS = gql`
  query getPipelinesResolver {
    getPipelinesResolver {
      pip_id
      pip_nombre
      pip_fechacreacion
      cantidadNegocios
    }
  }
`;

export const GET_ETAPAS_EMBUDOS = gql`
  query getEtapaPorId($id: Int) {
    getEtapaPorIdResolver(id: $id) {
      eta_id
      eta_nombre
      eta_avance
      eta_orden
      eta_diasinactivos
    }
  }
`;
export const GET_ETAPAS_EMBUDOS_TODOS = gql`
  query getEtapas {
    getEtapasResolver {
      eta_id
      eta_nombre
      eta_avance
      eta_orden
      eta_diasinactivos
      pip_id
    }
  }
`;
export const GET_EMBUDOS_CON_ETAPAS = gql`
  query getPipelinesWithStage {
    getPipelineWithStagesResolver {
      pip_id
      pip_nombre
    }
  }
`;

export const GET_PIPELINE_POR_BORRAR = gql`
  query getPipelinePorBorrar($idPipeline: Int) {
    getPipelinePorBorrarResolver(idPipeline: $idPipeline)
  }
`;
