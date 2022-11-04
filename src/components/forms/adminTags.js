/* eslint-disable array-callback-return */
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button } from "antd";
import React, { useContext } from "react";
import { Fragment } from "react";
import { GET_TAGS } from "../../Graphql/queries/tags";
import { DrawerContext } from "../context/DrawContext";
import { DealContext } from "../context/DealCotext";
import { SET_ETIQUETA_POR_NEGOCIO } from "../../Graphql/mutations/tags";
import { CheckOutlined } from "@ant-design/icons";

const AdminTags = () => {
  const { tagsList, tagsNegId, setTagsList, negId } = useContext(DealContext);
  const { onClose } = useContext(DrawerContext);
  const [setEtiquetaXNegocioResolver] = useMutation(SET_ETIQUETA_POR_NEGOCIO);
  const { data } = useQuery(GET_TAGS);

  let selected;
  if (!data) return "";

  if (!tagsList) {
    setTagsList([]);
  }

  const editTags = () => {
    const input = {
      etiquetaXnegocioIndividual: tagsList,
    };

    setEtiquetaXNegocioResolver({
      variables: { input, idNegocio: tagsNegId || negId },
    });
    setTagsList([]);
    onClose();
  };

  const addNewTag = (tagId) => {
    let algo = [];

    if (tagsList && tagsList.length === 0) {
      setTagsList([...tagsList, { etq_id: tagId }]);
    }

    tagsList.filter((item) => {
      if (item.etq_id === tagId) {
        algo = tagsList.filter((element) => {
          return element.etq_id !== tagId;
        });
        setTagsList(algo);
      } else {
        setTagsList([...tagsList, { etq_id: tagId }]);
      }
    });
  };

  return (
    <Fragment>
      {data.getEtiquetasResolver.map((tag) => {
        if (tagsList) {
          selected = tagsList.filter((tagL) => {
            if (tagL.etq_id === tag.etq_id) {
              return true;
            } else {
              return false;
            }
          });
        }

        const { etq_nombre, etq_color, etq_id } = tag;

        return (
          <div className="tags_wrapper">
            <div
              className="tag"
              onClick={() => addNewTag(etq_id)}
              style={{
                background: etq_color,
              }}
            >
              <span className="tag_name">{etq_nombre}</span>
              {selected &&
                selected.length > 0 &&
                selected[0].etq_id === tag.etq_id && (
                  <CheckOutlined color="white" />
                )}
            </div>
          </div>
        );
      })}

      <Button type="primary" block style={{ marginTop: 10 }} onClick={editTags}>
        {" "}
        Guardar
      </Button>
    </Fragment>
  );
};

export default AdminTags;
