import { FC } from "react"

interface VPUISVGProps {
  theme: "dark" | "light"
  size?: number
  opacity?: number
}

export const VPUISVG: FC<VPUISVGProps> = ({
  theme,
  size = 200,
  opacity = 1
}) => {
  const scale = size / 200

  // Define grey colors for dark and light themes
  const darkThemeColor = `rgba(200, 200, 200, ${opacity})` // Light grey for dark theme
  const lightThemeColor = `rgba(100, 100, 100, ${opacity})` // Dark grey for light theme

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle Background */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill={theme === "dark" ? darkThemeColor : lightThemeColor}
      />

      {/* VP Initials */}
      <g
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="80"
        fill={
          theme === "dark"
            ? "rgba(50, 50, 50, 0.9)"
            : "rgba(240, 240, 240, 0.9)"
        }
      >
        <text x="70" y="125" textAnchor="middle">
          V
        </text>
        <text x="130" y="125" textAnchor="middle">
          P
        </text>
      </g>
    </svg>
  )
}
