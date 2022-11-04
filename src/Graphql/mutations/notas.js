import { gql } from '@apollo/client';

export const NEW_NOTA = gql`
	mutation newNota($input: notaInput, $idNegocio: Int, $idUsuario: Int) {
		newNotaResolver(input: $input, idNegocio: $idNegocio, idUsuario: $idUsuario)
	}
`;
export const NOTA_ANCLADA = gql`
	mutation notaAnclada($idNota: Int, $anclado: Int) {
		notaAncladaResolver(idNota: $idNota, anclado: $anclado)
	}
`;

export const UPDATE_NOTA = gql`
	mutation updateNota($idNota: Int, $input: notaInput) {
		updateNotaResolver(idNota: $idNota, input: $input)
	}
`;
export const NOTA_ARCHIVADA = gql`
	mutation notaArchivada($idNota: Int) {
		notaArchivadaResolver(idNota: $idNota)
	}
`;
