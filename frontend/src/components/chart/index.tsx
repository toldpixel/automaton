"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Scrape, useScrapeContext } from "@/context/chartBoxPlotContext";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

type Props = {
  overviewResults: Scrape[];
};

//! overviewResults comes from props but individual scrapeResults from Context store dont do this again
export function ChartComponent({ overviewResults }: Props) {
  const { scrapes } = useScrapeContext(); // Scrape results in global store ChartBoxPlotContext available
  // Function to extract numeric value from US price format
  const extractPrice = (priceString?: string): number => {
    if (!priceString) return 0;

    const match = priceString.match(/\d+(.|,)\d+/g);
    if (!match) return 0;
    const parsedValue = parseFloat(match[0].replace(/,/g, ""));
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  /*const chartData = scrapes.map((scrape) => ({
    gpu: scrape.gpu || "Unknown",
    price: extractPrice(scrape.price_monthly || scrape.price_hourly),
  }));*/

  /*
  If individual rows are picked from the datatable then show them, if price monthly is available then
  then show monthly otherwise hourly 
  else if its the nothing picked yet then show overview of all data
  */
  console.log(overviewResults);
  const chartData = (scrapes.length > 0 ? scrapes : overviewResults).map(
    (scrape) => ({
      gpu: scrape.gpu || "Unknown",
      price:
        scrapes.length > 0
          ? extractPrice(scrape.price_monthly || scrape.price_hourly)
          : extractPrice(scrape.price_hourly || scrape.price_monthly),
    })
  );

  // Dynamically calculate tick spacing
  const prices = chartData.map((data) => data.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const range = maxPrice - minPrice;
  const tickStep = range <= 100 ? 1 : 1000; // Adjust spacing dynamically
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
      <ChartContainer config={chartConfig} className="min-h-[600px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />

          {scrapes.length > 0 && ( // When in overview mode then no price labels otherwise its too much
            <XAxis
              dataKey="gpu"
              tickLine={false}
              axisLine={false}
              interval={0} // Ensures every label is displayed
              height={100}
              tick={{
                angle: -25, // Rotate the labels 45 degrees counter-clockwise
                textAnchor: "end", // Align the text to the end of the tick
                fill: "#fff", // Set label color to white for better visibility
                fontSize: 13, // Adjust font size
                dy: 10,
              }}
            />
          )}

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
              value: `Price in $ per ${scrapes.length > 0 ? "month" : "hour"}`, // Text for the legend
              angle: -90, // Rotate the label to match the Y-axis orientation
              position: "insideLeft", // Position the label inside the chart
              dx: -4,
              style: {
                textAnchor: "middle",
                fill: "#fff",
                fontSize: 16,
              }, // Style the label
            }}
          />

          <Bar
            dataKey="price"
            fill="#2563eb"
            radius={4}
            label={
              scrapes.length > 0 // When in overview mode then no price labels otherwise its too much
                ? ({ x, y, width, value }) => (
                    <text
                      x={x + width / 4} // Position to the right of the bar
                      y={y - 5} // Vertically center with the bar
                      fill="#fff" // Text color
                      fontSize={12} // Adjust font size
                      textAnchor="start" // Align text to the start
                    >
                      {`$ ${value}`}{" "}
                      {/* Display the price with a dollar sign */}
                    </text>
                  )
                : ""
            }
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
