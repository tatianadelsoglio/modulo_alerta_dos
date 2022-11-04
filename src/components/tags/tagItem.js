import React, { useContext } from "react";
import { DealContext } from "../context/DealCotext";

const TagItem = ({ title, color, inDeal }) => {
  const { tagClose } = useContext(DealContext);

  //   const handleClick = () => {
  //     setTagClose(!tagClose);
  //   };

  return (
    <div>
      <div
        style={{ background: color, color: `${title === "" ? color : null}` }}
        className={tagClose || inDeal ? `tag_item` : `tag_item_close`}
        // se comenta la función que muestra el nombre de las etiquetas.
        // onClick={handleClick}
      >
        {title === "" ? "." : title}
      </div>
    </div>
  );
};

export default TagItem;
