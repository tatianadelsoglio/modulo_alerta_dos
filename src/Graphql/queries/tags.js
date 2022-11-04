import { gql } from '@apollo/client';

export const GET_TAGS = gql`
	query getEtiquetas {
		getEtiquetasResolver {
			etq_id
			etq_nombre
			etq_color
		}
	}
`;
