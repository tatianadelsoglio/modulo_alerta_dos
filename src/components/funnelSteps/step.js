import React from "react";
import { Tooltip } from "antd";

function Step({ containerWidth, title, count }) {
  if (containerWidth === 0) return;

  const widthStep = containerWidth / count;
  const viewBox = `0 0 ${widthStep} 20`;
  return (
    <Tooltip placement="top" title={title}>
      {containerWidth !== 0 && (
        <svg width={widthStep} height="20px" viewBox={viewBox}>
          <g
            data-name="Rect\xE1ngulo 1"
            fill="currentcolor"
            stroke="currentcolor"
            strokeWidth={2}
          >
            <rect width={widthStep} height={20} rx={3} stroke="#fff" />
          </g>
        </svg>
      )}
    </Tooltip>
  );
}

export default Step;
