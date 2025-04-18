"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"

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

  // This is using the experimental useEffectEvent hook
  const updateColors = React.useEffectEvent(() => {
    if (!containerRef.current) return

    const colorObj: ChartColors = {}

    for (const [key, value] of Object.entries(config)) {
      colorObj[key] = {
        label: value.label,
        color: value.color,
      }
    }

    setColors(colorObj)
  })

  useEffect(() => {
    updateColors()
  }, [config])

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

// Rest of the component code...
