"use client";

import { DefaultRawDatum, PieCustomLayerProps, ResponsivePie } from "@nivo/pie";

interface Props {
  data: {
    id: string;
    label?: string;
    value: number;
    color: string;
  }[];
  centerText?: string;
}
export default function DonutChart({ data, centerText }: Props) {
  const CenteredMetric = ({
    centerX,
    centerY,
  }: PieCustomLayerProps<DefaultRawDatum>) => {
    return (
      <text
        className="font-semibold text-xl "
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        fill="hsl(var(--primary))"
      >
        {centerText}
      </text>
    );
  };
  return (
    <div className="w-64 h-full text-black">
      <ResponsivePie
        data={data}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        innerRadius={0.5}
        activeOuterRadiusOffset={8}
        padAngle={0.7}
        colors={{ datum: "data.color" }}
        cornerRadius={3}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
        layers={[
          "arcs",
          "arcLabels",
          "arcLinkLabels",
          "legends",
          CenteredMetric,
        ]}
      />
    </div>
  );
}
