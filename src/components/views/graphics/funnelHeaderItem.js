import React from "react";

const FunnelHeaderItem = ({ data, total }) => {
  let acumulado = 0;

  return (
    <>
      {data &&
        data.length > 0 &&
        data.map((item, idx) => {
          let percent = Math.floor((item.value * 100) / total);
          if (idx + 1 !== data.length) {
            acumulado = acumulado + percent;
          } else {
            const resto = 100 - Math.floor(acumulado);
            percent = resto;
          }
          return (
            <div className="funnel_items_wrapper">
              <div className="funnel_item">
                {item.label} (
                {Math.floor(percent) >= 0
                  ? percent.toLocaleString("de-DE", {
                      maximumFractionDigits: 0,
                    })
                  : 0}
                %)
              </div>
            </div>
          );
        })}
    </>
  );
};

export default FunnelHeaderItem;
