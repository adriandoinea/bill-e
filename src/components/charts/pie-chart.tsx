"use client";

import { cn } from "@/lib/utils";
import { DefaultRawDatum, PieCustomLayerProps, ResponsivePie } from "@nivo/pie";

interface Props {
  data: {
    id: string;
    label?: string;
    value: number;
    color: string;
  }[];
  centerText?: string;
  className?: string;
  isDonut?: boolean;
}
export default function PieChart({
  data,
  centerText,
  className,
  isDonut,
}: Props) {
  const config = isDonut
    ? {
        innerRadius: 0.5,
        cornerRadius: 3,
      }
    : {
        innerRadius: 0,
        cornerRadius: 0,
      };

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
    <div className={cn("w-64 h-full text-black", className)}>
      <ResponsivePie
        {...config}
        data={data}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        colors={{ datum: "data.color" }}
        activeOuterRadiusOffset={8}
        padAngle={0.7}
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
