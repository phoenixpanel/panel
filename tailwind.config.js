const colors = require("tailwindcss/colors");

// Dark theme color palette
const gray = {
  50: "#e5e7eb", // Off-white (lighter text/highlights)
  100: "#d1d5db", // Light grey (base text)
  200: "#c5ccd6",
  300: "#aab3bf",
  400: "#8b95a1",
  500: "#6a747e",
  600: "#4f5861",
  650: "#272727", // Darkish grey (ServerRow BG)
  700: "#3b4148", // Darker grey (secondary elements/borders)
  800: "#2a2f33", // Very dark grey (secondary elements/borders)
  900: "#23272a", // Near-black (primary background)
  925: "#2b2b2b",
  950: "#1e1e1e",
};

// Phoenix color palette
const phoenix = {
  50: "#fff3e0", // Lightest orange
  100: "#ffe0b2", // Very light orange
  200: "#ffcc80", // Light orange
  300: "#ffb74d", // Medium-light orange
  400: "#ffa726", // Medium orange
  500: "#ff9500", // Phoenix secondary (bright orange-yellow)
  600: "#e25822", // Phoenix primary (deep orange-red)
  700: "#d84315", // Dark orange-red
  800: "#bf360c", // Very dark orange-red
  900: "#8B2500", // Phoenix dark (darkest red-brown)
};

// Phoenix Status Colors
const status = {
  50: "#3C9E33", // Online
  100: "#DC3545", // Offline
  200: "#9747FF", // Transferring
  300: "#FD7E14", // Starting Up
};

module.exports = {
  content: ["./resources/scripts/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        header: ['"IBM Plex Sans"', '"Roboto"', "system-ui", "sans-serif"],
      },
      colors: {
        black: gray[900], // Use the darkest gray as black
        // "primary" and "neutral" are deprecated, prefer the use of "blue" and "gray"
        // in new code.
        primary: { ...phoenix }, // Use the phoenix palette as primary
        gray: gray,
        neutral: gray, // Use the gray palette for neutral
        phoenix: phoenix, // Add phoenix color palette
        status: status, // Add status color palette
        // Replace cyan with phoenix colors for consistency
        cyan: {
          50: "#fff3e0", // Lightest orange
          100: "#ffe0b2", // Very light orange
          200: "#ffcc80", // Light orange
          300: "#ffb74d", // Medium-light orange
          400: "#ffa726", // Medium orange
          500: "#ff9500", // Phoenix secondary (bright orange-yellow)
          600: "#e25822", // Phoenix primary (deep orange-red)
          700: "#d84315", // Dark orange-red
          800: "#bf360c", // Very dark orange-red
          900: "#8B2500", // Phoenix dark (darkest red-brown)
        },
      }, // Correct closing brace for colors object
      fontSize: {
        "2xs": "0.625rem",
      },
      transitionDuration: {
        250: "250ms",
      },
      borderColor: (theme) => ({
        default: theme("colors.neutral.700", "currentColor"), // Use a darker border color
      }),
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};
