/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {
  Fragment,
  useRef,
  useEffect,
  useState,
  useContext,
} from "react";
import "./funnelStep.styles.scss";
import { Radio, Tooltip } from "antd";

import Step from "./step";
import { compare } from "../../utils/compareSteps";
import { DealContext } from "../context/DealCotext";

const FunnelStep = ({ setFunnelStep, steps, idPipeline, stepsFinal }) => {
  const [selectSteps, setSelectSteps] = useState([]);
  const funnelStep = useRef();
  const [containerWidth, setContainerWidth] = useState(0);
  const [etapaInicial, setEtapaInicial] = useState();

  const { etaIdParaForm, setEtaIdParaForm } = useContext(DealContext);

  useEffect(() => {
    if (stepsFinal && stepsFinal.length > 0) {
      setEtapaInicial(Number(stepsFinal[0].eta_id));
      setEtaIdParaForm(Number(stepsFinal[0].eta_id));
    }

    // if (steps.legnth === 0) return;
    if (containerWidth === 0) {
      setContainerWidth(funnelStep.current.clientWidth);
    } else {
      // return;
    }

    let etapas = steps.filter((step) => {
      return step.pip_id === idPipeline;
    });

    etapas = etapas.sort(compare);

    setSelectSteps(steps);
    if (selectSteps.length === 0) return;

    // setFunnelStep(etapas);
    // if (etapas.length > 0) {
    //   setFunnelStep(etapas[0].eta_id);
    // }
  }, [funnelStep, steps, idPipeline, stepsFinal]);

  const funnelStepIcons = (count, title, eta_id) => {
    return (
      <Step
        count={count}
        containerWidth={containerWidth}
        title={title}
        etaId={eta_id}
      />
    );
  };

  const stepsList = [];

  selectSteps.forEach((step) => {
    const { eta_nombre, eta_id } = step;
    stepsList.push(funnelStepIcons(selectSteps.length, eta_nombre, eta_id));
  });

  const list = Object.assign({}, stepsList);

  const onChange = (list) => {
    if (!list) return;

    const { etaId } = list.props;

    setFunnelStep(Number(etaId));
  };

  const onChangeValue = (e) => {
    setEtapaInicial(e.target.value);
    setEtaIdParaForm(e.target.value);
  };

  return (
    <Fragment>
      <div ref={funnelStep} className="funnel-step-wrapper">
        <Radio.Group
          onChange={onChangeValue}
          defaultValue={etapaInicial || etaIdParaForm}
          value={etapaInicial || etaIdParaForm}
        >
          {stepsFinal.map((item, idx) => {
            return (
              <>
                <Tooltip placement="top" title={item.eta_nombre} key={idx}>
                  <Radio value={Number(item.eta_id)} key={item.eta_id}></Radio>
                </Tooltip>
              </>
            );
          })}
        </Radio.Group>
      </div>
    </Fragment>
  );
};

export default FunnelStep;
