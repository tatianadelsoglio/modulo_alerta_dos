import { useQuery } from "@apollo/react-hooks";
import { Button } from "antd";
import React, { useContext } from "react";
import { Fragment } from "react";
import { GET_TAGS } from "../../Graphql/queries/tags";
import { DrawerContext } from "../context/DrawContext";
import OldTagItem from "../tags/oldTagItem";

const AddTags = () => {
  const { onChildrenDrawerClose } = useContext(DrawerContext);
  const { data } = useQuery(GET_TAGS);

  if (!data) return "";

  return (
    <Fragment>
      {data.getEtiquetasResolver.map((tag) => {
        //
        const { etq_nombre, etq_color, etq_id } = tag;
        return (
          <OldTagItem
            name={etq_nombre}
            color={etq_color}
            key={etq_id}
            tagId={etq_id}
          />
        );
      })}

      <Button
        type="default"
        block
        style={{ marginTop: 10 }}
        onClick={onChildrenDrawerClose}
      >
        {" "}
        Cerrar
      </Button>
    </Fragment>
  );
};

export default AddTags;
