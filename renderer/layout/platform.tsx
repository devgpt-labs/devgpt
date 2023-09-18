import React, { useState } from "react";
import SideBar from "@/src/components/global/sidebar";
import { Flex } from "@chakra-ui/react";
import getIsUserOnLatestRelease from "@/src/utils/getIsUserOnLatestRelease";
import { Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

export default function PlatformLayout({ children }: any) {
    const { pathname } = window.location;
    const displaySidebar = pathname.includes("/platform")
    const [isUserOnLatestRelease, setIsUserOnLatestRelease] = useState(false);

    getIsUserOnLatestRelease().then((isUserOnLatestRelease) => {
        setIsUserOnLatestRelease(isUserOnLatestRelease);
    })

    return (
        <Flex
            flexDirection="row"
            height='100vh'
            maxW="100vw"
        >
            <Flex
                id="titlebar"
                className="titlebar"
                style={{
                    // @ts-ignore
                    "-webkit-app-region": "drag",
                }}
                alignItems="center"
                position="absolute"
                justifyContent="flex-end"
                top={0}
                bgColor={isUserOnLatestRelease ? "#2D3748" : "#DD6B20"}
                width="100%"
                p={4}
                height={30}
            >
                {!isUserOnLatestRelease && (
                    <>
                        <Text>{`You're on an old version, upgrade for the best experience`}</Text>
                        <WarningIcon mx={2} />
                    </>
                )}
            </Flex>
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


