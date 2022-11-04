import { gql } from '@apollo/client';

export const SET_ETIQUETA_POR_NEGOCIO = gql`
	mutation setEtiquetaXNegocio($input: etiquetaXnegocioInput, $idNegocio: Int) {
		setEtiquetaXNegocioResolver(input: $input, idNegocio: $idNegocio)
	}
`;

export const UPDATE_ETIQUETA = gql`
	mutation updateEtiqueta($idEtiqueta: Int, $input: EtiquetaInput) {
		updateEtiquetaResolver(idEtiqueta: $idEtiqueta, input: $input)
	}
`;
