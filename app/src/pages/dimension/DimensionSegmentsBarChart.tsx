import { useMemo } from "react";
import { graphql, useFragment } from "react-relay";
import { format } from "d3-format";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartTooltip,
  ChartTooltipItem,
  defaultBarChartTooltipProps,
  getBinName,
  useSequentialChartColors,
} from "@phoenix/components/chart";

import { DimensionSegmentsBarChart_dimension$key } from "./__generated__/DimensionSegmentsBarChart_dimension.graphql";

// Type interfaces to conform to
type BarChartItem = {
  name: string;
  percent: number;
};

const formatter = format(".2f");

const useColors = () => {
  const { primary } = useSequentialChartColors();
  return {
    color: primary,
  };
};
function TooltipContent({
  active,
  payload,
  label,
}: TooltipContentProps<BarChartItem["percent"], BarChartItem["name"]>) {
  const { color } = useColors();
  if (active && payload && payload.length && typeof label === "string") {
    const value = payload[0]?.value;
    return (
      <ChartTooltip>
        <ChartTooltipItem
          color={color}
          shape="square"
          name={label}
          value={value != null ? `${formatter(value)}%` : "--"}
        />
      </ChartTooltip>
    );
  }

  return null;
}

/**
 * Bar chart that displays the different segments of data for a given dimension
 * E.x. dimension=state, segments=[CA, NY, TX, ...]
 */
export function DimensionSegmentsBarChart(props: {
  dimension: DimensionSegmentsBarChart_dimension$key;
}) {
  const data = useFragment<DimensionSegmentsBarChart_dimension$key>(
    graphql`
      fragment DimensionSegmentsBarChart_dimension on Dimension
      @argumentDefinitions(timeRange: { type: "TimeRange!" }) {
        id
        segmentsComparison(primaryTimeRange: $timeRange) {
          segments {
            bin {
              ... on NominalBin {
                __typename
                name
              }
              ... on IntervalBin {
                __typename
                range {
                  start
                  end
                }
              }
              ... on MissingValueBin {
                __typename
              }
            }
            counts {
              primaryValue
            }
          }
          totalCounts {
            primaryValue
          }
        }
      }
    `,
    props.dimension
  );

  const chartData = useMemo<BarChartItem[]>(() => {
    const segments = data.segmentsComparison?.segments ?? [];
    const total = data.segmentsComparison?.totalCounts?.primaryValue ?? 0;
    return segments.map((segment) => {
      const segmentCount = segment.counts?.primaryValue ?? 0;
      const binName = getBinName(segment.bin);
      const percent = (segmentCount / total) * 100;
      return {
        name: binName,
        percent,
      };
    });
  }, [data]);

  const { color } = useColors();
  return (
    <ResponsiveContainer>
      <BarChart
        data={chartData}
        margin={{
          top: 25,
          right: 18,
          left: 18,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient
            id="dimensionSegmentsBarColor"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={color} stopOpacity={1} />
            <stop offset="95%" stopColor={color} stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          style={{ fill: "var(--ac-global-text-color-700)" }}
        />
        <YAxis
          stroke="var(--ac-global-color-grey-500)"
          label={{
            value: "% Volume",
            angle: -90,
            position: "insideLeft",
            style: {
              textAnchor: "middle",
              fill: "var(--ac-global-text-color-900)",
            },
          }}
          style={{ fill: "var(--ac-global-text-color-700)" }}
        />
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="var(--ac-global-color-grey-500)"
          strokeOpacity={0.5}
        />
        <Tooltip {...defaultBarChartTooltipProps} content={TooltipContent} />
        <Bar
          dataKey="percent"
          fill="url(#dimensionSegmentsBarColor)"
          spacing={15}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
