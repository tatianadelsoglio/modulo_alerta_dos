import { gql } from '@apollo/client';

// export const GET_NOTAS_POR_NEGOCIO = gql`
// 	query getNotasByNegocioResolver($idNegocio: Int) {
// 		getNotasByNegocioResolver(idNegocio: $idNegocio) {
// 			not_id
// 			not_desc
// 			not_fechahora
// 			pri_desc
// 			usu_id
// 			usu_nombre
// 		}
// 	}
// `;

export const GET_NOTA_POR_ID = gql`
	query getNotaById($idNota: Int) {
		getNotaByIdResolver(idNota: $idNota) {
			not_id
			not_desc
			not_fechahora
			not_archivado
			not_importancia
			usu_id
		}
	}
`;
