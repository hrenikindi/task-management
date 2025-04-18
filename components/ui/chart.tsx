"use client"

import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
}

type ChartColors = {
  [key: string]: {
    label?: React.ReactNode
    color?: string
  }
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({ config, children, ...props }: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [colors, setColors] = useState<ChartColors>({})

  // Using useCallback instead of useEffectEvent
  const updateColors = useCallback(() => {
    if (!containerRef.current) return

    const colorObj: ChartColors = {}

    for (const [key, value] of Object.entries(config)) {
      colorObj[key] = {
        label: value.label,
        color: value.color,
      }
    }

    setColors(colorObj)
  }, [config])

  useEffect(() => {
    updateColors()
  }, [updateColors])

  return (
    <div
      ref={containerRef}
      {...props}
      style={
        {
          "--color-chart-background": "var(--chart-background)",
          ...Object.entries(colors).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [`--color-${key}`]: value.color,
            }),
            {},
          ),
          ...props.style,
        } as React.CSSProperties
      }
    >
      <ChartContext.Provider value={{ config }}>{children}</ChartContext.Provider>
    </div>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  )
}

interface ChartTooltipProps {
  children: React.ReactNode
}

export function ChartTooltip({ children }: ChartTooltipProps) {
  return <RechartsPrimitive.Tooltip content={children} />
}

interface ChartTooltipContentProps {
  className?: string
}

export function ChartTooltipContent({ className }: ChartTooltipContentProps) {
  return ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={cn("rounded-lg border bg-background p-2 shadow-md", className)}>
          <div className="grid grid-flow-row gap-1">
            <p className="text-sm font-medium">{label}</p>
            {payload.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-1 text-xs">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
                <span className="font-medium">{item.name}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return null
  }
}

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
    >
      {payload.map((item: any) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value}
            className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config]
}

export { ChartLegend, ChartLegendContent, ChartStyle }
