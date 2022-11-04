import { FileDoneOutlined } from "@ant-design/icons";
import { Timeline as TL } from "antd";
import React, { Fragment } from "react";
import NoteItem from "./noteItem";

const Notes = ({ notes }) => {
  return (
    <Fragment>
      {notes &&
        notes.map((note) => {
          const { not_id } = note;

          return (
            <TL.Item
              key={not_id}
              dot={<FileDoneOutlined className="timeline-clock-icon" />}
            >
              <NoteItem note={note} attached />
            </TL.Item>
          );
        })}
    </Fragment>
  );
};

export default Notes;
