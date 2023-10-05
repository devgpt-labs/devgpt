"use client";
import { useState, useEffect } from "react";
import {
	Flex,
	Text,
	Box,
	SlideFade,
	Skeleton,
	Heading,
	CardBody,
	Card,
	Tag,
	Grid,
	GridItem,
	Badge,
	StackDivider,
	Stack,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Button,
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
	IconButton,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	useColorMode,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightElement,
} from "@chakra-ui/react";

import Link from "next/link";
import ModelCard from "./ModelCard";

//stores
import authStore from "@/store/Auth";
import repoStore from "@/store/Repos";
import { supabase } from "@/utils/supabase";
import Setup from "@/components/repos/Setup";
import { useRouter } from "next/router";

//utils
import moment from "moment";
import calculateTotalCost from "@/utils/calculateTotalCost";
import getModels from "@/utils/getModels";

//components
import Template from "@/components/Template";
import RepoDrawer from "@/components/repos/RepoDrawer";

//icons
import {
	EditIcon,
	DeleteIcon,
	SmallAddIcon,
	ArrowBackIcon,
} from "@chakra-ui/icons";
import { BiCircle, BiSolidDollarCircle } from "react-icons/bi";
import { PiSelectionBackground } from "react-icons/pi";
import { AiFillCheckCircle } from "react-icons/ai";
import { PiCircleLight } from "react-icons/pi";

const Models = ({ onClose }: any) => {
	const { user, stripe_customer_id, credits }: any = authStore();
	const router = useRouter();
	const { colorMode }: any = useColorMode();
	const { repos, repoWindowOpen, setRepoWindowOpen }: any = repoStore();
	const [showBilling, setShowBilling] = useState<boolean>(false);
	const [budget, setBudget] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [modelsInTraining, setModelsInTraining] = useState<Model[]>([]);

	interface Model {
		id: string;
		created_at: string;
		user_id: string;
		repo: string;
		owner: string;
		branch: string;
		epochs: number;
		output: string;
		training_method: string;
		sample_size: number;
		frequency: number;
	}

	const handleBudgetChange = (e: any) => {
		setBudget(e.target.value);
	};

	useEffect(() => {
		getModels(setModelsInTraining, setLoading, stripe_customer_id);

		// if (modelsInTraining.length > 0) {
		//   setBudget(Number(calculateTotalCost(modelsInTraining, 0)));
		// }

		// set budget to a
	}, [repos]);

	const calculateStatSum = (stat: string) => {
		return modelsInTraining.length > 0 ? (
			<>
				{modelsInTraining
					.map((model: any) => model?.[stat])
					.reduce((a: any, b: any) => a + b, 0)}
			</>
		) : (
			0
		);
	};

	return (
		<Template>
			<Flex
				flex={1}
				w="full"
				overflowY="scroll"
				height="100vh"
				flexDirection="column"
				p={4}
				bg={colorMode === "light" ? "gray.50" : "black"}
			>
				<Flex
					alignItems="center"
					justifyContent="space-between"
					gap={3}
					mb={3}
					mr={10}
				>
					<Flex flexDirection="row" alignItems="center">
						<Link href="/platform/agent">
							<IconButton
								onClick={() => {
									router.back();
								}}
								aria-label="Close"
								icon={<ArrowBackIcon />}
							/>
						</Link>
						<Heading size="md" ml={4}>
							Trained Models
						</Heading>
					</Flex>
					<Flex gap={2}>
						<Button
							onClick={() => {
								setRepoWindowOpen(!repoWindowOpen);
								onClose();
							}}
							rightIcon={<SmallAddIcon />}
						>
							Create
						</Button>
						<Button
							onClick={() => {
								if (showBilling) return setShowBilling(false);

								setShowBilling(true);
								const element = document.getElementById("billing");
								element?.scrollIntoView({ behavior: "smooth" });
							}}
							rightIcon={<BiSolidDollarCircle />}
						>
							Billing
						</Button>
					</Flex>
				</Flex>

				{loading ? (
					<Grid templateColumns="repeat(3, 1fr)" gap={3}>
						<Flex flexDirection="row" gap={4}>
							<Skeleton width="400px" height="400px" />
							<Skeleton width="400px" height="400px" />
							<Skeleton width="400px" height="400px" />
						</Flex>
					</Grid>
				) : modelsInTraining.length > 0 ? (
					<Grid templateColumns="repeat(3, 1fr)" gap={3} flexWrap="wrap">
						{modelsInTraining.map((model: any) => {
							return (
								<ModelCard
									model={model}
									modelsInTraining={modelsInTraining}
									setModelsInTraining={setModelsInTraining}
								/>
							);
						})}
					</Grid>
				) : (
					<Flex
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						gap={2}
						width="100%"
						height="100%"
					>
						<Text>No models found yet</Text>
						<Button
							onClick={() => {
								setRepoWindowOpen(!repoWindowOpen);
								onClose();
							}}
							rightIcon={<SmallAddIcon />}
						>
							Train A New Model
						</Button>
					</Flex>
				)}
				<SlideFade in={showBilling} offsetY="20px" id="billing">
					<Box p={5} mt={5}>
						<Heading size="lg" mb={3}>
							Billing
						</Heading>
						<Flex flexDirection={"column"} mb={3}>
							<Heading size="md" mb={4} mt={2}>
								Current Balance: <Tag>${credits?.toFixed(2) || 0}</Tag>
							</Heading>
							<Text mb={2}>Monthly Budget</Text>
							<InputGroup>
								<InputLeftAddon children="$" />
								<Input
									min={Number(calculateTotalCost(modelsInTraining, 0))}
									max={10000000}
									value={budget}
									onChange={handleBudgetChange}
									type="number"
									placeholder="per month"
								/>
								<InputRightElement width="4.5rem">
									<Button h="1.75rem" size="sm" onClick={() => {}}>
										Save
									</Button>
								</InputRightElement>
							</InputGroup>
						</Flex>
						<TableContainer>
							<Table variant="striped">
								<Thead>
									<Tr>
										<Th>Model name</Th>
										<Th isNumeric>Epochs</Th>
										<Th isNumeric>Sample_Size</Th>
										<Th isNumeric>Frequency</Th>
									</Tr>
								</Thead>
								<Tbody>
									{modelsInTraining.length > 0 ? (
										<>
											{modelsInTraining.map((model: any) => {
												return (
													<>
														<Tr>
															<Td>{model.repo}</Td>
															<Td isNumeric>{model.epochs}</Td>
															<Td isNumeric>{model.sample_size}</Td>
															<Td isNumeric>{model.frequency}</Td>
														</Tr>
													</>
												);
											})}
										</>
									) : (
										<Text>No models have been trained yet.</Text>
									)}
								</Tbody>
								<Tfoot>
									<Tr>
										<Th>Total</Th>
										<Th isNumeric>{calculateStatSum("epochs")}</Th>
										<Th isNumeric>{calculateStatSum("sample_size")}</Th>
										<Th isNumeric>{calculateStatSum("frequency")}</Th>
									</Tr>
									<Tr>
										<Th>Estimated monthly cost</Th>
										<Th isNumeric></Th>
										<Th isNumeric></Th>
										<Th isNumeric>
											<Heading>
												${calculateTotalCost(modelsInTraining, 0)}
											</Heading>
										</Th>
									</Tr>
								</Tfoot>
							</Table>
						</TableContainer>
					</Box>
				</SlideFade>
			</Flex>
			<RepoDrawer />
		</Template>
	);
};

export default Models;
