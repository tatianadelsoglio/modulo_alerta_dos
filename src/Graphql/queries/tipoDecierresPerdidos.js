import { gql } from '@apollo/client';

export const GET_TIPO_CIERRE_PERDIDO = gql`
	query getTipoCierresPerdidos {
		getTipoCierresPerdidosResolver {
			cie_id
			cie_desc
		}
	}
`;
