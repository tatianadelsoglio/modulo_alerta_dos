import { gql } from '@apollo/client';

export const GET_PRODUCTOS = gql`
	query getProductos {
		getProductosResolver {
			prod_id
			prod_desc
			prod_idsistema
		}
	}
`;
export const GET_PRODUCTOS_LIMIT = gql`
	query getProductosLimit($input: String, $listaProductosElegidos: listaProductosElegidos) {
		getProductosLimitResolver(input: $input, listaProductosElegidos: $listaProductosElegidos) {
			prod_id
			prod_desc
		}
	}
`;
