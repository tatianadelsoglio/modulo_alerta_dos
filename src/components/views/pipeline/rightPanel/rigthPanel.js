/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Drawer } from "antd";
import { DrawerContext } from "../../../context/DrawContext";
import NewDealForm from "../../../forms/newDealForm";
import AddProduct from "../../../forms/addProduct";
import AddCompetitors from "../../../forms/addCompetitors";
import NewPipeline from "../../../forms/newPipeline";
import DealWon from "../../../forms/dealWon";
import DealMissed from "../../../forms/dealMissed";
import AddDateSinceUntil from "../../../forms/addDateSinceUntil";
import Filters from "../../../forms/filters";
import NewTask from "../../../forms/newTask";
import NewNote from "../../../forms/newNote";
import AddFile from "../../../forms/addFiles";
import EditDealForm from "../../../forms/editDealForm";
import { DealContext } from "../../../context/DealCotext";
import EditTask from "../../../forms/editTask";
import AddSharedUser from "../../../forms/addSharedUser";
import AddTags from "../../../forms/addTags";
import AdminTags from "../../../forms/adminTags";
import DealCancel from "../../../forms/dealCancel";
import MasiveDeals from "../../../forms/masivo/masiveDeals";
import ReasignDeal from "../../../forms/reasignDeal";

const RigthPanel = ({ idPipeline }) => {
  // const { stateDrawer, setStateDrawer } = useContext(DrawerContext);
  const {
    onClose,
    drawerNameChildren,
    onChildrenDrawerClose,
    stateDrawer,
    drawerName,
    drawerDetail,
  } = useContext(DrawerContext);

  const { notId, sharedUsers, deal } = useContext(DealContext);

  const [dealProducts, setDealProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [dealCompetitors, setDealCompetitors] = useState([]);
  const [widthDrawer, setWidthDrawer] = useState(400);
  const [widthDrawerChildren, setWidthDrawerChildren] = useState(650);

  // funcion que crea el drawer dependiendo de dónde se llame. La orden la maneja el componente pileline.a1

  useEffect(() => {
    setWidthDrawers();
  }, [drawerName, drawerNameChildren, widthDrawer, dealProducts]);

  const setWidthDrawers = () => {
    switch (drawerName) {
      case "Añadir usuarios compartidos":
        setWidthDrawer(450);

        break;
      case "Agregar Negocio":
        setWidthDrawer(380);

        break;
      case "Editar Negocio":
        setWidthDrawer(380);

        break;

      case "Reasignar Negocio":
        setWidthDrawer(380);
        break;

      case "Agregar Producto":
        setWidthDrawer(650);
        break;
      case "Productos":
        setWidthDrawer(650);
        break;
      case "Nuevo Embudo":
        setWidthDrawer(400);
        break;
      case `Crear Etapas`:
        setWidthDrawer(400);

        break;
      case "Agregar Etapas":
        setWidthDrawer(400);
        break;
      case "Negocio Ganado":
        setWidthDrawer(380);
        break;
      case "Negocio Perdido":
        setWidthDrawer(380);
        break;
      case "Negocio Anulado":
        setWidthDrawer(380);
        break;
      case "Entre fechas":
        setWidthDrawer(380);
        break;
      case "Filtros":
        setWidthDrawer(500);
        break;

      case "Competidores":
        setWidthDrawer(550);
        break;
      case "Nueva Nota":
        setWidthDrawer(450);
        break;
      case "Nueva Tarea":
        setWidthDrawer(650);
        break;
      case "Nuevo Adjunto":
        setWidthDrawer(400);
        break;
      case "Editar Nota":
        setWidthDrawer(400);
        break;
      case "Editar Tarea":
        setWidthDrawer(650);
        break;

      case "Negocio Masivo":
        setWidthDrawer(550);
        break;
      case "Administrar etiquetas":
        setWidthDrawer(300);
        break;
      default:
        setWidthDrawer(1200);
        break;
    }

    switch (drawerNameChildren) {
      case "Productos":
        setWidthDrawerChildren(650);
        break;
      case "Competidores":
        setWidthDrawerChildren(550);
        break;
      case "Agregar Etiquetas":
        setWidthDrawerChildren(300);
        break;

      default:
        break;
    }
  };

  const createDrawer = () => {
    return (
      <Drawer
        title={`${drawerName} ${drawerDetail}`}
        destroyOnClose={true}
        width={widthDrawer}
        closable={false}
        onClose={onClose}
        visible={stateDrawer.visible}
      >
        {createFormDraw(drawerName)}
        <Drawer
          title={drawerNameChildren}
          width={widthDrawerChildren}
          closable={false}
          onClose={onChildrenDrawerClose}
          visible={stateDrawer.childrenDrawer}
          destroyOnClose={true}
        >
          {createFormDrawChildren(drawerNameChildren)}
        </Drawer>
      </Drawer>
    );
  };
  const createFormDraw = (titleDraw) => {
    switch (titleDraw) {
      case "Añadir usuarios compartidos":
        return <AddSharedUser usuarios={sharedUsers} />;
      case "Agregar Negocio":
        return <NewDealForm />;
      case "Editar Negocio":
        return <EditDealForm deal={deal} />;
      case "Nuevo Embudo":
        // setNewPipelineState(false);
        return <NewPipeline idPipeline={idPipeline} />;
      case "Agregar Etapas":
        // setNewPipelineState(true);

        return <NewPipeline idPipeline={idPipeline} />;
      case "Negocio Ganado":
        // setNewPipelineState(true);

        return <DealWon />;
      case "Negocio Perdido":
        // setNewPipelineState(true);

        return <DealMissed />;

      case "Negocio Masivo":
        return <MasiveDeals />;

      case "Negocio Anulado":
        return <DealCancel />;

      case "Entre fechas":
        // @ts-ignore
        return <AddDateSinceUntil />;
      case "Filtros":
        return <Filters />;
      case "Productos":
        return (
          <AddProduct
            totalProducts={totalProducts}
            setDealProducts={setDealProducts}
            setTotalProducts={setTotalProducts}
          />
        );
      case "Competidores":
        return (
          <AddCompetitors
            dealCompetitors={dealCompetitors}
            setDealCompetitors={setDealCompetitors}
          />
        );

      case "Reasignar Negocio":
        return <ReasignDeal />;

      case "Nueva Nota":
        return <NewNote id={notId} />;

      case "Nueva Tarea":
        return <NewTask edit={false} />;
      case "Nuevo Adjunto":
        return <AddFile />;
      case "Editar Nota":
        return <NewNote edit={true} id={notId} />;
      case "Editar Tarea":
        return <EditTask edit />;
      case "Administrar etiquetas":
        return <AdminTags />;
      default:
    }
  };
  const createFormDrawChildren = (titleDrawerChildren) => {
    switch (titleDrawerChildren) {
      case "Productos":
        return (
          <AddProduct
            totalProducts={totalProducts}
            setDealProducts={setDealProducts}
            setTotalProducts={setTotalProducts}
          />
        );
      case "Competidores":
        return (
          <AddCompetitors
            dealCompetitors={dealCompetitors}
            setDealCompetitors={setDealCompetitors}
          />
        );
      case "Agregar Etiquetas":
        return <AddTags></AddTags>;

      default:
        break;
    }
  };

  return <Fragment>{createDrawer()}</Fragment>;
};

export default RigthPanel;
