import { gql } from '@apollo/client';

export const NEW_PRODUCTO_NEGOCIO = gql`
    mutation newProductoXNegocio($input:productoXNegocioInput, $idNegocio:Int){
        newProductoXNegocioResolver(input:$input, idNegocio: $idNegocio)
    }
`;