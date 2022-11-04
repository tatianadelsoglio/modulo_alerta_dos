import { gql } from '@apollo/client';


export const GET_ULTIMO_HISTORIAL = gql`
query getUltimoHistorial($id:Int){
    getUltimoHistorialResolver(id:$id){
      his_id
      his_fechaupdate
    }
  }
`;