import { gql } from "@apollo/client";

export const GET_CLIENTES = gql`
  query getClientes {
    getClientesResolver {
      cli_id
      cli_nombre
      cli_idsistema
    }
  }
`;

export const GET_CLIENTES_LIMITADO = gql`
  query getClientesLimit($input: String, $idUsuario: Int) {
    getClientesLimitResolver(input: $input, idUsuario: $idUsuario) {
      cli_nombre
      cli_id
      cli_idsistema
    }
  }
`;

export const GET_CLIENTES_PARA_NEGOCIO_MASIVO = gql`
  query getClientesParaNegocioMasivoResolver($idUsuario: Int) {
    getClientesParaNegocioMasivoResolver(idUsuario: $idUsuario) {
      cli_nombre
      cli_id
      cli_idsistema
    }
  }
`;

export const GET_CONTACTOS = gql`
  query getContactos($id: Int) {
    getContactosResolver(id: $id) {
      con_id
      con_nombre
    }
  }
`;

export const GET_MONEDAS = gql`
  query getMonedas {
    getMonedasResolver {
      mon_id
      mon_divisa
      mon_pais
      mon_iso
      mon_codigo
    }
  }
`;

export const GET_CLIENTES_PARA_FILTRO = gql`
  query getClientesParaFiltroResolver($input: String, $idUsuario: Int) {
    getClientesParaFiltroResolver(input: $input, idUsuario: $idUsuario) {
      cli_nombre
      cli_id
      cli_idsistema
    }
  }
`;
