//   ██████╗██╗  ██╗ █████╗ ██████╗ ████████╗     ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗		//
//  ██╔════╝██║  ██║██╔══██╗██╔══██╗╚══██╔══╝    ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝		//
//  ██║     ███████║███████║██████╔╝   ██║       ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗	//
//  ██║     ██╔══██║██╔══██║██╔══██╗   ██║       ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║	//
//  ╚██████╗██║  ██║██║  ██║██║  ██║   ██║       ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝	//
//   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝        ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝		//
// Archivo de configuración de gráficos. Aquí cada tipo de gráfica mantiene su configuración.		//
/////////////////////////////////////////////////////////////////////////////////////////////////////

//  ██████╗  █████╗ ██████╗  ██████╗██╗  ██╗ █████╗ ██████╗ ████████╗
//  ██╔══██╗██╔══██╗██╔══██╗██╔════╝██║  ██║██╔══██╗██╔══██╗╚══██╔══╝
//  ██████╔╝███████║██████╔╝██║     ███████║███████║██████╔╝   ██║
//  ██╔══██╗██╔══██║██╔══██╗██║     ██╔══██║██╔══██║██╔══██╗   ██║
//  ██████╔╝██║  ██║██║  ██║╚██████╗██║  ██║██║  ██║██║  ██║   ██║
//  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
//
export const barConfig = {
  indexBy: "usuario",
  margin: { top: 10, right: 60, bottom: 60, left: 60 },
  padding: 0.3,
  minValue: 0,
  // maxValue: 10,
  valueScale: { type: "linear" },
  indexScale: { type: "band", round: true },
  colors: ["hsl(144, 70%, 50%)", "hsl(347, 70%, 50%)"],
  defs: [
    {
      id: "Abiertos",
      // type: 'patternDots',
      background: "inherit",
      // color: '#38bcb2',
      size: 4,
      padding: 1,
      stagger: true,
    },
    {
      id: "Cerrados",
      // type: 'patternLines',
      background: "inherit",
      rotation: -45,
      lineWidth: 6,
      spacing: 10,
    },
  ],

  borderColor: { from: "color", modifiers: [["darker", 1.6]] },
  axisTop: null,
  axisRight: null,
  axisBottom: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    // legend: 'Usuarios',
    legendPosition: "middle",
    legendOffset: 32,
  },
  axisLeft: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "Cantidad de negocios",
    legendPosition: "middle",
    legendOffset: -40,
  },
  labelSkipWidth: 12,
  labelSkipHeight: 12,
  labelTextColor: "white",
  legends: [
    {
      dataFrom: "keys",
      anchor: "bottom",
      direction: "row",
      justify: false,
      translateX: 0,
      translateY: 55,
      itemsSpacing: 2,
      itemWidth: 100,
      itemHeight: 20,
      itemDirection: "left-to-right",
      itemOpacity: 0.85,
      symbolSize: 20,
      effects: [
        {
          on: "hover",
          style: {
            itemOpacity: 1,
          },
        },
      ],
    },
  ],
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
};
//  ███████╗██╗   ██╗███╗   ██╗███╗   ██╗███████╗██╗          ██████╗██╗  ██╗ █████╗ ██████╗ ████████╗
//  ██╔════╝██║   ██║████╗  ██║████╗  ██║██╔════╝██║         ██╔════╝██║  ██║██╔══██╗██╔══██╗╚══██╔══╝
//  █████╗  ██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗  ██║         ██║     ███████║███████║██████╔╝   ██║
//  ██╔══╝  ██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝  ██║         ██║     ██╔══██║██╔══██║██╔══██╗   ██║
//  ██║     ╚██████╔╝██║ ╚████║██║ ╚████║███████╗███████╗    ╚██████╗██║  ██║██║  ██║██║  ██║   ██║
//  ╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚══════╝     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
//
export const funnelConfig = {
  height: 300,
  margin: { top: 50, right: 20, bottom: 50, left: 20 },
  direction: "horizontal",
  shapeBlending: 0.66,
  valueFormat: " >-.4",
  colors: { scheme: "yellow_green" },
  borderWidth: 8,
  borderColor: "#18b715",
  borderOpacity: 0.4,
  labelColor: { from: "color", modifiers: [["darker", "2.8"]] },
  theme: {
    labels: {
      text: {
        fontSize: "1.5rem",
      },
    },
  },

  beforeSeparatorLength: 16,
  enableAfterSeparators: false,
  afterSeparatorLength: 29,
  currentPartSizeExtension: 33,
  currentBorderWidth: 34,
  motionConfig: "slow",
};

//  ██████╗ ██╗███████╗     ██████╗██╗  ██╗ █████╗ ██████╗ ████████╗
//  ██╔══██╗██║██╔════╝    ██╔════╝██║  ██║██╔══██╗██╔══██╗╚══██╔══╝
//  ██████╔╝██║█████╗      ██║     ███████║███████║██████╔╝   ██║
//  ██╔═══╝ ██║██╔══╝      ██║     ██╔══██║██╔══██║██╔══██╗   ██║
//  ██║     ██║███████╗    ╚██████╗██║  ██║██║  ██║██║  ██║   ██║
//  ╚═╝     ╚═╝╚══════╝     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
//

export const pieChartConfig = {
  margin: { top: 40, right: 80, bottom: 80, left: 80 },
  innerRadius: 0.5,
  padAngle: 0.7,
  cornerRadius: 3,
  activeOuterRadiusOffset: 8,
  colors: ["hsl(144, 70%, 50%)", "hsl(347, 70%, 50%)"],
  borderWidth: 1,
  borderColor: { from: "color", modifiers: [["darker", 0.2]] },
  arcLinkLabelsSkipAngle: 10,
  arcLinkLabelsTextColor: "#333333",
  arcLinkLabelsThickness: 2,
  arcLinkLabelsColor: { from: "color" },
  arcLabelsSkipAngle: 10,
  arcLabelsTextColor: "#ffffff",

  defs: [
    {
      id: "dots",
      // type: 'patternDots',
      background: "inherit",
      color: "rgba(255, 255, 255, 0.3)",
      size: 4,
      padding: 1,
      stagger: true,
    },
    {
      id: "lines",
      // type: 'patternLines',
      background: "inherit",
      color: "rgba(255, 255, 255, 0.3)",
      rotation: -45,
      lineWidth: 6,
      spacing: 10,
    },
  ],
  fill: [
    {
      match: {
        id: "ruby",
      },
      id: "dots",
    },
    {
      match: {
        id: "c",
      },
      id: "dots",
    },
    {
      match: {
        id: "go",
      },
      id: "dots",
    },
    {
      match: {
        id: "python",
      },
      id: "dots",
    },
    {
      match: {
        id: "scala",
      },
      id: "lines",
    },
    {
      match: {
        id: "lisp",
      },
      id: "lines",
    },
    {
      match: {
        id: "elixir",
      },
      id: "lines",
    },
    {
      match: {
        id: "javascript",
      },
      id: "lines",
    },
  ],
  legends: [
    {
      anchor: "bottom",
      direction: "row",
      justify: false,
      translateX: 0,
      translateY: 56,
      itemsSpacing: 0,
      itemWidth: 100,
      itemHeight: 18,
      itemTextColor: "#999",
      itemDirection: "left-to-right",
      itemOpacity: 1,
      symbolSize: 18,
      symbolShape: "circle",
      effects: [
        {
          on: "hover",
          style: {
            itemTextColor: "#000",
          },
        },
      ],
    },
  ],
};
