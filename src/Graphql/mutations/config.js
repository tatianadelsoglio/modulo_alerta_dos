import { gql } from '@apollo/client';

export const NEW_CONGIG = gql`
	mutation setConfiguracion($monId: Int) {
		setConfiguracionResolver(monId: $monId)
	}
`;
