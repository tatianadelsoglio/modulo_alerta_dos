import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import React, { useContext, useState } from "react";
import { Button } from "antd";
import { Fragment } from "react";
import { DealContext } from "../context/DealCotext";

const OldTagItem = ({
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

  // useEffect(() => {
  //   setTagsListFilter([]);
  // }, [checked]);

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
    <Fragment>
      <div className="tags_wrapper">
        <div
          className="tag"
          onClick={() => addTag(tagId)}
          style={{
            background: color,
            width: autorizado ? "82%" : "100%",
            marginRight: autorizado ? 5 : 0,
          }}
        >
          <span className="tag_name">{name}</span>
          {checked && <CheckOutlined color="white" />}
        </div>
        {autorizado && (
          <Button type="link" size="small" onClick={addNameTag}>
            <EditOutlined />
          </Button>
        )}
      </div>
    </Fragment>
  );
};

export default OldTagItem;
