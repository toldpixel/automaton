"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { useScrapeContext } from "@/context/chartBoxPlotContext";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export function ChartComponent() {
  const { scrapes } = useScrapeContext();

  // Function to extract numeric value from US price format
  const extractPrice = (priceString?: string): number => {
    if (!priceString) return 0;
    console.log(priceString);
    const match = priceString.match(/\d+(.|,)\d+/g);
    console.log(match);
    if (!match) return 0;
    const parsedValue = parseFloat(match[0].replace(/,/g, ""));
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  const chartData = scrapes.map((scrape) => ({
    gpu: scrape.gpu || "Unknown",
    price: extractPrice(scrape.price_monthly || scrape.price_hourly),
  }));

  // Dynamically calculate tick spacing
  const prices = chartData.map((data) => data.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const range = maxPrice - minPrice;
  const tickStep = range <= 10 ? 0.5 : 1500; // Adjust spacing dynamically
  const ticks = [];
  for (
    let i = Math.floor(minPrice / tickStep) * tickStep;
    i <= maxPrice;
    i += tickStep
  ) {
    ticks.push(i);
  }

  const chartConfig = {
    price: {
      label: "Price",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <YAxis
            type="number"
            dataKey="price"
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
            tickCount={10}
            interval={0}
            tickFormatter={(value) => `$ ${value}`}
            ticks={ticks}
            label={{
              value: "Price in $", // Text for the legend
              angle: -90, // Rotate the label to match the Y-axis orientation
              position: "insideLeft", // Position the label inside the chart
              style: { textAnchor: "middle", fill: "#fff", fontSize: 14 }, // Style the label
            }}
          />
          <ChartLegend content={<ChartLegendContent />} />

          <Bar
            dataKey="price"
            fill="#2563eb"
            radius={4}
            label={({ x, y, width, value }) => (
              <text
                x={x + width / 4} // Position to the right of the bar
                y={y - 5} // Vertically center with the bar
                fill="#fff" // Text color
                fontSize={12} // Adjust font size
                textAnchor="start" // Align text to the start
              >
                {`$ ${value}`} {/* Display the price with a dollar sign */}
              </text>
            )}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
