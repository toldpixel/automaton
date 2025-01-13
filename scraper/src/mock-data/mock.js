//ChatGPT
export const generateMockData = () => {
  const getRandomPrice = (min, max) => {
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  const mock = [
    {
      name: "Instance A",
      gpu: "Sample",
      storage: "2 TB SSD",
      network: "10 Gbps",
      egress: "1 TB",
      price_monthly: `$${getRandomPrice(1000, 2000)}`,
      price_hourly: `$${getRandomPrice(1.0, 2.0)}`,
    },
    {
      name: "Instance B",
      gpu: "Sample",
      storage: "1 TB SSD",
      network: "5 Gbps",
      egress: "500 GB",
      price_monthly: `$${getRandomPrice(600, 1000)}`,
      price_hourly: `$${getRandomPrice(0.8, 1.5)}`,
    },
    {
      name: "Instance C",
      gpu: "Sample",
      storage: "3 TB HDD",
      network: "1 Gbps",
      egress: "2 TB",
      price_monthly: `$${getRandomPrice(500, 800)}`,
      price_hourly: `$${getRandomPrice(0.5, 1.2)}`,
    },
    {
      name: "Instance D",
      gpu: "Sample",
      storage: "512 GB SSD",
      network: "100 Mbps",
      egress: "Unlimited",
      price_monthly: `$${getRandomPrice(300, 500)}`,
      price_hourly: `$${getRandomPrice(0.4, 0.7)}`,
    },
    {
      name: "Instance E",
      gpu: "Sample",
      storage: "1.5 TB SSD",
      network: "20 Gbps",
      egress: "Unlimited",
      price_monthly: `$${getRandomPrice(1200, 1800)}`,
      price_hourly: `$${getRandomPrice(1.5, 2.5)}`,
    },
    {
      name: "Instance F",
      gpu: "Sample",
      storage: "256 GB SSD",
      network: "1 Gbps",
      egress: "1 TB",
      price_monthly: `$${getRandomPrice(400, 700)}`,
      price_hourly: `$${getRandomPrice(0.6, 1.0)}`,
    },
  ];

  return mock;
};
