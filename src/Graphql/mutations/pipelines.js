import { gql } from "@apollo/client";

export const NEW_PIPELINE = gql`
  mutation newPipelines($input: pipelinesInput) {
    newPipelineResolver(input: $input) {
      pip_id
    }
  }
`;

export const UPDATE_NOMBRE_PIPELINE = gql`
  mutation updateNombrePipelineResolver(
    $idPipeline: Int
    $nombrePipeline: String
  ) {
    updateNombrePipelineResolver(
      idPipeline: $idPipeline
      nombrePipeline: $nombrePipeline
    )
  }
`;

export const DELETE_PIPELINE_Y_ETAPAS = gql`
  mutation deletePipeline($idPipeline: Int) {
    deletePipelineResolver(idPipeline: $idPipeline)
  }
`;
