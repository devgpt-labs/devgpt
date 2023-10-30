"use client";
import {
  Flex,
} from "@chakra-ui/react";

//stores
import authStore from "@/store/Auth";

//utils

//components

//icons
import PlanCard from "./PlanCard";
import { FaStar } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { PiShootingStarFill } from "react-icons/pi";
import planIntegers from "@/configs/planIntegers";

const Plans = () => {
  const { user, isPro }: any = authStore();

  return (
    <Flex flexDirection="row" gap={4} width="100%" flexWrap='wrap'>
      <PlanCard
        Icon={<FaStar />}
        title="Individual"
        price={`$${planIntegers.individual.price} /mo`}
        description={`The individual plan allows you to train and maintain ${planIntegers.individual.models} model and use of DevGPT prompting.`}
        detail="Includes a 7-day free plan"
        link={`${planIntegers.individual.link}?prefilled_email=${user?.email}`}
        image="https://assets-global.website-files.com/64b68d0793d2d75fa6defaa5/64b68d0793d2d75fa6defbc5_DALL%25C2%25B7E%25202023-07-04%252010.57.46%2520-%2520a%2520renaissance%2520painting%2520of%2520a%2520robot%2520being%2520born%2520in%2520medieval%2520times-p-500.png"
        popular={false}
        purchased={isPro === 'individual'}
      />
      <PlanCard
        Icon={<BsStars />}
        title="Business"
        price={`$${planIntegers.business.price} /mo`}
        description={`The business plan allows you to train up to ${planIntegers.business.models} models and increased use of DevGPT prompting.`}
        detail={`Allows for up to ${planIntegers.business.team_members} team members`}
        link={`${planIntegers.business.link}?prefilled_email=${user?.email}`}
        image="https://assets-global.website-files.com/64b68d0793d2d75fa6defaa5/64b68d0793d2d75fa6defbb3_DALLE%20(1).png"
        popular={true}
        purchased={isPro === 'business'}
      />
      <PlanCard
        Icon={<PiShootingStarFill />}
        title="Enterprise"
        price="Contact"
        description="Enterprise allows you to take control. Train more models and run more prompts."
        detail="Allows for more than 12 team members"
        link={planIntegers.enterprise.link}
        image="https://cdn.openai.com/labs/images/Two%20futuristic%20towers%20with%20a%20skybridge%20covered%20in%20lush%20foliage,%20digital%20art.webp?v=1"
        popular={false}
        purchased={isPro === 'enteprise'}
      />
    </Flex>
  );
};

export default Plans;
