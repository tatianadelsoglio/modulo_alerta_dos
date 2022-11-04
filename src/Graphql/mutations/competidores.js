import { gql } from '@apollo/client';

export const NEW_COMPETIDORES_NEGOCIO = gql`
	mutation newCompetidoresXNegocio($input: competidoresXNegocioInput, $idNegocio: Int) {
		newCompetidoresXNegocioResolver(input: $input, idNegocio: $idNegocio)
	}
`;
