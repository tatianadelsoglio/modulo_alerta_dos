import { gql } from '@apollo/client';

export const GET_CONFIG = gql`
	query getConfiguracion {
		getConfiguracionResolver
	}
`;
