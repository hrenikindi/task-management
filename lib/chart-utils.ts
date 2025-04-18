// Simple utility functions for charts
export function formatChartData(data: any[]) {
  return data.map((item) => ({
    ...item,
    formattedValue: typeof item.value === "number" ? `${item.value.toFixed(2)}` : item.value,
  }))
}

export function getChartColors(theme: "light" | "dark") {
  return {
    light: {
      primary: "hsl(221.2 83.2% 53.3%)",
      secondary: "hsl(215 20.2% 65.1%)",
      success: "hsl(142.1 76.2% 36.3%)",
      warning: "hsl(38 92% 50%)",
      danger: "hsl(0 84.2% 60.2%)",
    },
    dark: {
      primary: "hsl(217.2 91.2% 59.8%)",
      secondary: "hsl(215 20.2% 65.1%)",
      success: "hsl(142.1 70.6% 45.3%)",
      warning: "hsl(48 96% 53%)",
      danger: "hsl(0 62.8% 30.6%)",
    },
  }[theme]
}
