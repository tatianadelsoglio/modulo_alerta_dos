import { gql } from '@apollo/client';

export const GET_TIMELINE_POR_NEGOCIO = gql`
	query getTimeLineByNegocioResolver($idNegocio: Int, $estadoTarea: Int) {
		getTimeLineByNegocioResolver(idNegocio: $idNegocio, estadoTarea: $estadoTarea)
	}
`;
