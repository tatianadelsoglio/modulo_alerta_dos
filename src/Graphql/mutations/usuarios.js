import { gql } from '@apollo/client';

export const COMPARTIR_USUARIO = gql`
	mutation newUsuariosXNegocio($idNegocio: Int, $input: usuariosInput) {
		newUsuariosXNegocioResolver(idNegocio: $idNegocio, input: $input)
	}
`;
