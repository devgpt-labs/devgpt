import { useEffect, useState } from "react";
import { useAuthContext } from "@/src/context";
import { Flex, Spinner } from "@chakra-ui/react";



const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [ renderPage, setRenderPage ] = useState(true);
    const { user, loading } = useAuthContext();

    
    useEffect(() => {
        if (user) {
            setRenderPage(false);
        } else {
            setTimeout(() => {
                if (loading) {
                    setRenderPage(loading);
                } 
                if (loading == false) {
                    setRenderPage(loading)
                
                } else {
                    setRenderPage(false);
                }
            }, 1000);
        }
    }, [loading]);
    
    return (
        <>
            {renderPage ? (
                <Flex 
                    justifyContent="center"
                    alignItems="center"
                    w="100vw"
                    h="60vh"
                >
                    <Spinner />
                </Flex>
            ) : (
                children
            )}
        </>
        
    )
}

export default LoadingProvider;