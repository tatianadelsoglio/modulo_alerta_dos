import { gql } from '@apollo/client';

export const GET_COTIZACION = gql`
	query getCotizaciones {
		fetchCotizacionAPIResolver
	}
`;
