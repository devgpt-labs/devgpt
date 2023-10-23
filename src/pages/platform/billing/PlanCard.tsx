"use client";
import {
  Flex,
  Text,
  Heading,
  Image,
  Stack,
  Card,
  CardBody,
} from "@chakra-ui/react";

const PlanCard = ({
  title,
  image,
  description,
  detail,
  link,
  price,
  Icon,
  popular,
  purchased,
}: any) => {
  return (
    <Card>
      <CardBody>
        <Image
          src={image}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
          height={150}
          width="100%"
          objectFit="cover"
        />
        <Stack mt="6" spacing="3">
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex flexDirection="row" alignItems="center">
              <Heading mr={2} size="md">
                {title}
              </Heading>
              {Icon}
            </Flex>
            {/* {popular && <Badge colorScheme='teal'>Most Popular</Badge>} */}
          </Flex>

          <Text>{description}</Text>
          <Text>{detail}</Text>
          {price && (
            <Text color="blue.600" fontSize="2xl">
              {price}
            </Text>
          )}
        </Stack>
      </CardBody>
      <Flex
        cursor={purchased ? "default" : "pointer"}
        alignItems="center"
        justifyContent="center"
        onClick={() => {
          purchased ? null : window.open(link, "_blank");
        }}
        gap="2"
        borderBottomRadius={10}
        width="100%"
        height={70}
        p={4}
        bg="#3e68ff"
      >
        <Text
          cursor={purchased ? "default" : "pointer"}
          color="white"
          fontWeight="bold"
        >
          {purchased ? "✓" : `Select ${title}`}
        </Text>
      </Flex>
    </Card>
  );
};

export default PlanCard;
