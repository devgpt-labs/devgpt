import React from "react";
import Footer from "./Footer";
import { AuthProvider } from "@/src/context";
import { ChakraProvider, Box } from "@chakra-ui/react";
import theme from "@/src/config/theme";
import { Provider } from "react-redux";
import store from "@/redux/store";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <Box>{children}</Box>
          <Footer />
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  );
};

export default PageWrapper;
