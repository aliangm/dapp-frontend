import { useState, useEffect } from "react";
import NextLink from "next/link";
import { Image } from "@chakra-ui/image";
import {
  Box,
  StackProps,
  Text,
  VStack,
  BoxProps,
  Spinner,
} from "@chakra-ui/react";
import React, { forwardRef } from "react";
import {
  Flex,
  Button,
  Spacer,
  forwardRef as fRef,
  HTMLChakraProps,
  chakra,
} from "@chakra-ui/react";
import { FrakCard } from "../../types";
import { motion, isValidMotionProp, HTMLMotionProps } from "framer-motion";
import FrakButton from "../../components/button";
import { useUserContext } from "@/contexts/userContext";
import Countdown,{zeroPad} from 'react-countdown';

interface NFTItemProps extends StackProps {
  // item: FrakCard;
  name: String;
  amount: Number;
  // price: Number;
  imageURL: String;
  // CTAText?: string;
  // wait: number;
  endTime: number;
}

const NFTAuctionItem = forwardRef<HTMLDivElement, NFTItemProps>(
  ({ item, amount, price, imageURL, name, onClick, CTAText, wait, endTime, showProgress }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timerOpacity,setTimerOpacity] = useState(0);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const { fraktions } = useUserContext();
    const [ended,setEnded] = useState(false);

    // const canList = item && !! (fraktions || []).find(fraktion => fraktion.id === item.id);

    // useEffect(() => {
    //   setIsImageLoaded(false);
    // }, []);

    const onImageLoad = (ms: number) => {
      setTimeout(() => {
        setIsImageLoaded(true);
      }, ms);
    };

    setTimeout(() => {
      setIsVisible(true);
    }, 0);

    const visibleStyle = { opacity: `1` };
    const inVisibleStyle = { opacity: `0` };
    const inVisibleAnimStyle = {
      animationName: `loadingCard`,
      animationDuration: `1s`,
      "animation-iteration-count": `infinite`,
    };

    const renderer = ({ days, hours, minutes, seconds, completed })=>{
      if (completed) {
        // Render a completed state
        setEnded(true);
        return <div>Ended</div>;
      } else {
        // Render a countdown
        if(days>0){
          return <span>{days} days :{zeroPad(hours)} hours</span>;
        }
        if(hours>0){
          return <span>{zeroPad(hours)} hours:{zeroPad(minutes)} mins</span>;
        }
        return <span>{zeroPad(minutes)} mins:{zeroPad(seconds)} secs</span>;
      }
    }

    return (
      <>
        {isVisible && (
          <Box
            w="30rem"
            rounded="md"
            borderWidth="1px"
            boxShadow="md"
            onClick={onClick}
            _hover={{
              boxShadow: "xl",
            }}
            ref={ref}
            sx={isImageLoaded ? null : inVisibleAnimStyle}
          >
            <VStack cursor="pointer">
              <Box
                h={isImageLoaded ? "35rem" : "0px"}
                w="100%"
                position="relative"
                sx={
                  isImageLoaded
                    ? visibleStyle
                    : inVisibleStyle /* toggle visibility */
                }
              >
                <Image
                  src={imageURL}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  margin-left="auto"
                  margin-right="auto"
                  display="flex"
                  sx={{
                    objectFit: `cover`,
                  }}
                  style={{ verticalAlign: "middle" }}
                  onLoad={() => onImageLoad(2000)}
                />
              </Box>
              {!isImageLoaded && (
                <Box
                  h="35rem"
                  w="100%"
                  position="relative"
                  sx={
                    !isImageLoaded /* inverse of image visibility */
                      ? visibleStyle
                      : inVisibleStyle /* toggle visibility */
                  }
                >
                  <Box
                    sx={{
                      display: "grid",
                      width: `100%`,
                      height: `100%`,
                      placeItems: `center`,
                    }}
                  >
                    <Spinner size="xl" />
                  </Box>
                </Box>
              )}
            </VStack>
            <Box margin="1rem">
              <Text className="semi-16" mb="1rem">
                {name}
              </Text>
              <Flex>
                {amount && (
                  <Text className="medium-12">{amount / 100}% Available</Text>
                )}

                <Spacer />
                {endTime&&<Image
                  align="vertical"
                  width="5"
                  height="5"
                  marginEnd="5px"
                  marginTop="5px"
                  src="timer.png"
                />}
                <Countdown renderer={renderer} date={Number(endTime)*1000} autoStart
                />
              </Flex>

              { showProgress && ended &&(
                <Box textAlign="center" marginTop={5}>
                  <NextLink href={"#"}>
                    <FrakButton >Claim Fraktions</FrakButton>
                  </NextLink>
                </Box>
              )}
              { showProgress && !ended && (
                <Box textAlign="center" marginTop={5}>
                  <NextLink href={`nft/${item.tokenAddress}/list-item`}>
                    <Button disabled size="lg">In Progress</Button>
                  </NextLink>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </>
    );
  }
);

export default NFTAuctionItem;
