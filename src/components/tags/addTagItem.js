/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";
import { DealContext } from "../context/DealCotext";
import { useQuery } from "@apollo/react-hooks";
import { GET_TAGS } from "../../Graphql/queries/tags";

const AddTagItem = ({
  name,
  color,
  tagId,
  isChecked,
  autorizado,
  setShowForm,
  filter,
}) => {
  // si isChecked viene en true... la etiqueta queda seleccionada
  const { tagsList, setTagsList, tagsListFilter, setTagsListFilter } =
    useContext(DealContext);
  const [checked, setChecked] = useState(false);
  const [listadoEtiquetas, setListadoEtiquetas] = useState([]);

  // const tagsFiltradosLocal = tagsListFilter;

  const { data } = useQuery(GET_TAGS);

  useEffect(() => {
    if (data) {
      setListadoEtiquetas(data.getEtiquetasResolver);
    }
  }, [data]);

  const addTag = (tagId) => {
    if (autorizado) return;
    setChecked(!checked);

    const tagSelected = {
      etq_id: tagId,
    };

    if (!checked) {
      if (filter) {
        setTagsListFilter([...tagsListFilter, tagSelected]);
      } else {
        setTagsList([...tagsList, tagSelected]);
      }
    } else {
      const selecteds = tagsList.filter((tag) => {
        return tag.etq_id !== tagId;
      });
      if (filter) {
        let selecteds = tagsListFilter.filter((tag) => {
          return tag.etq_id !== tagId;
        });

        setTagsListFilter(selecteds);
      } else {
        setTagsList(selecteds);
      }
    }
  };
  const addNameTag = () => {
    setShowForm(tagId);
  };

  return (
    <>
      {listadoEtiquetas &&
        listadoEtiquetas.length > 0 &&
        listadoEtiquetas.map((tag) => {
          let checked2 = false;

          if (tagsListFilter.length > 0) {
            tagsListFilter.filter((item) => {
              if (item.etq_id === tag.etq_id) {
                checked2 = true;
              }
            });
          }

          return (
            <div className="tags_wrapper">
              <div
                className="tag"
                onClick={() => addTag(tag.etq_id)}
                style={{
                  background: tag.etq_color,
                  width: autorizado ? "82%" : "100%",
                  marginRight: autorizado ? 5 : 0,
                }}
              >
                <span className="tag_name">{tag.etq_nombre}</span>
                {checked2 && <CheckOutlined color="white" />}
              </div>
              {autorizado && (
                <Button type="link" size="small" onClick={addNameTag}>
                  <EditOutlined />
                </Button>
              )}
            </div>
          );
        })}
    </>
  );
};

export default AddTagItem;
