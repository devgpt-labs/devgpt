import React, { Suspense } from "react";
import SideBar from "@/src/components/global/sidebar";
import { Flex } from "@chakra-ui/react";

export default function PlatformLayout({ children }: any) {
    const { pathname } = window.location;
    const displaySidebar = pathname.includes("/platform")

    return (
        <Flex
            flexDirection="row"
            height='100vh'
            maxW="100vw"
        >
            {displaySidebar ? (
                <>
                    <SideBar />
                    {children}
                </>
            ) : (
                <>
                    {children}
                </>
            )}
        </Flex>
    );
}
