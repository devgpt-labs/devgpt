import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
  fonts: {
    heading: `'SatoshiBold', sans-serif`,
    body: `'SatoshiRegular', sans-serif`,
  },
  components: {
    Card: {
      defaultProps: {
        variant: "solid",
      },
    },
    Button: {
      variants: {
        cta: {
          bg: "#319795",
          color: "white",
          fontWeight: "bold",
          _hover: {
            bg: "blue.600",
          },
          _active: {
            bg: "blue.700",
          },
        },
      },
    },
  },
  styles: {
    global: () => ({
      body: {
        bg: "black",
        // bg: "gray.800",
        //bg: "blue.900",
        //bg: "#111111",
      },
    }),
  },
  colors: {
    blue: {
      50: "#3e68ff",
      100: "#3e68ff",
      200: "#3e68ff",
      300: "#3e68ff",
      400: "#3e68ff",
      500: "#3e68ff",
      600: "#274ed9",
      700: "#274ed9",
      800: "#274ed9",
    },
  },
});

export default theme;
