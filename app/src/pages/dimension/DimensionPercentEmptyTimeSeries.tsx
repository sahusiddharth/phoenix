import { graphql, useLazyLoadQuery } from "react-relay";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";

import { Text } from "@phoenix/components";
import {
  ChartTooltip,
  ChartTooltipItem,
  defaultTimeXAxisProps,
  useSequentialChartColors,
  useTimeTickFormatter,
} from "@phoenix/components/chart";
import { useTimeRange } from "@phoenix/contexts/TimeRangeContext";
import { fullTimeFormatter } from "@phoenix/utils/timeFormatUtils";
import { calculateGranularity } from "@phoenix/utils/timeSeriesUtils";

import { DimensionPercentEmptyTimeSeriesQuery } from "./__generated__/DimensionPercentEmptyTimeSeriesQuery.graphql";
import { timeSeriesChartMargins } from "./dimensionChartConstants";

const numberFormatter = new Intl.NumberFormat([], {
  maximumFractionDigits: 2,
});

const useColors = () => {
  const { grey100 } = useSequentialChartColors();

  return {
    color: grey100,
  };
};
function TooltipContent({
  active,
  payload,
  label,
}: TooltipContentProps<number, string>) {
  const { color } = useColors();
  if (active && payload && payload.length) {
    const percentEmpty = payload[0]?.value ?? null;
    const percentEmptyString =
      typeof percentEmpty === "number"
        ? numberFormatter.format(percentEmpty)
        : "--";
    return (
      <ChartTooltip>
        {label && (
          <Text weight="heavy" size="S">{`${fullTimeFormatter(
            new Date(label)
          )}`}</Text>
        )}
        <ChartTooltipItem
          color={color}
          name="% Empty"
          value={percentEmptyString}
        />
      </ChartTooltip>
    );
  }

  return null;
}

export function DimensionPercentEmptyTimeSeries({
  dimensionId,
}: {
  dimensionId: string;
}) {
  const { timeRange } = useTimeRange();
  const granularity = calculateGranularity(timeRange);
  const data = useLazyLoadQuery<DimensionPercentEmptyTimeSeriesQuery>(
    graphql`
      query DimensionPercentEmptyTimeSeriesQuery(
        $dimensionId: ID!
        $timeRange: TimeRange!
        $granularity: Granularity!
      ) {
        embedding: node(id: $dimensionId) {
          id
          ... on Dimension {
            percentEmptyTimeSeries: dataQualityTimeSeries(
              metric: percentEmpty
              timeRange: $timeRange
              granularity: $granularity
            ) {
              data {
                timestamp
                value
              }
            }
          }
        }
      }
    `,
    {
      dimensionId,
      timeRange: {
        start: timeRange.start.toISOString(),
        end: timeRange.end.toISOString(),
      },
      granularity,
    }
  );

  const chartData =
    data.embedding.percentEmptyTimeSeries?.data.map((d) => ({
      timestamp: new Date(d.timestamp).valueOf(),
      value: d.value,
    })) || [];

  const timeTickFormatter = useTimeTickFormatter({
    samplingIntervalMinutes: granularity.samplingIntervalMinutes,
  });

  const { color } = useColors();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={timeSeriesChartMargins}
        syncId={"dimensionDetails"}
      >
        <defs>
          <linearGradient id="percentEmptyColorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          {...defaultTimeXAxisProps}
          tickFormatter={(x) => timeTickFormatter(new Date(x))}
        />
        <YAxis
          stroke="var(--ac-global-color-grey-500)"
          label={{
            value: "% Empty",
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
        <Tooltip content={TooltipContent} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          fillOpacity={1}
          fill="url(#percentEmptyColorUv)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
