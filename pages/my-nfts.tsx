import { gql, useQuery } from "@apollo/client";
import { Grid, HStack, VStack } from "@chakra-ui/layout";
import Head from "next/head";
import React, {useEffect, useState, useCallback} from "react";
import { BigNumber } from "ethers";
import { FrakCard } from "../types";
import NFTItem from "../components/nft-item";
import NextLink from "next/link";
import styles from "../styles/my-nfts.module.css";
import FrakButton from "../components/button";
import { useWeb3Context } from '../contexts/Web3Context';
import { getAccountFraktalNFTs, createObject } from '../utils/graphQueries';
const { create, CID } = require('ipfs-http-client');
export default function MyNFTsView() {
  const { account } = useWeb3Context();
  const [nftItems, setNftItems] = useState();
  // filter only by my account

  async function getFraktals(account){
    let data
    // setInterval(async function(){
    data = await getAccountFraktalNFTs('account_fraktals',account)
    console.log('data fetched: ', data,' - account: ', account);
    // }, 180)
    if(data){
      console.log('--')
      Promise.all(data.fraktalNFTs.map(x=>{return createObject(x)})).then((results)=>setNftItems(results))
    }else{
      setNftItems([])
    }
  }
  useEffect(()=>{
    getFraktals(account)
  },[account])

  const demoNFTItemsFull: FrakCard[] = Array.from({ length: 3 }).map(
    (_, index) => ({
      id: index + 1,
      name: "Golden Fries Cascade",
      imageURL: "/filler-image-1.png",
      //contributions: BigNumber.from(5).div(100),
      createdAt: new Date().toISOString(),
      //countdown: new Date("06-25-2021"),
    })
  );
  const demoNFTFraktionsFull: FrakCard[] = Array.from({ length: 2 }).map(
    (_, index) => ({
      id: index + 1,
      name: "Golden Fries Cascade",
      imageURL: "/filler-image-2.png",
      //contributions: BigNumber.from(5).div(100),
      createdAt: new Date().toISOString(),
      //countdown: new Date("06-25-2021"),
    })
  );
  return (
    <VStack spacing='0' mb='12.8rem'>
      <Head>
        <title>Fraktal - My NFTs</title>
      </Head>
      <div className={styles.header}>My NFTs</div>
      <button onClick={()=>console.log(nftItems)}>test</button>
      {nftItems?.length ? (
        <Grid
          mt='40px !important'
          ml='0'
          mr='0'
          mb='5.6rem !important'
          w='100%'
          templateColumns='repeat(3, 1fr)'
          gap='3.2rem'
        >
          {nftItems.map(item => (
            <NFTItem key={item.id} item={item} CTAText={"List on Market"} />
          ))}
        </Grid>
      ) : (
        <div style={{ marginTop: "8px" }}>
          <div className={styles.descText}>
            Transfer NFT to your wallet or Mint a new NFT.
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <FrakButton style={{ width: "240px", marginTop: "24px" }}>
              Mint NFT
            </FrakButton>
          </div>
        </div>
      )}
      <div className={styles.header2}>My Fraktions</div>
      {nftItems?.length ? (
        <div style={{ marginTop: "16px" }}>
          <div className={styles.subText}>You have earned</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "8px",
            }}
          >
            <div className={styles.claimContainer}>
              <div style={{ marginLeft: "24px" }}>
                <div className={styles.claimHeader}>ETH</div>
                <div className={styles.claimAmount}>125.99</div>
              </div>
              <div className={styles.claimCTA}>Claim</div>
            </div>
          </div>
          <Grid
            mt='40px !important'
            ml='0'
            mr='0'
            mb='5.6rem !important'
            w='100%'
            templateColumns='repeat(3, 1fr)'
            gap='3.2rem'
          >
            {demoNFTFraktionsFull.map(item => (
              <NextLink href={`/nft/${item.id}/manage`} key={item.id}>
                <NFTItem item={item} CTAText={"Manage"} />
              </NextLink>
            ))}
          </Grid>
        </div>
      ) : (
        <div style={{ marginTop: "8px" }}>
          <div className={styles.descText}>
            Head over to the marketplace and invest to get some Fraktions!
            <br /> If you have already invested, contributions do not appear
            until the auctions are over.
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <NextLink href={"/"}>
              <FrakButton
                isOutlined
                style={{ width: "240px", marginTop: "24px" }}
              >
                Back to Marketplace
              </FrakButton>
            </NextLink>
          </div>
        </div>
      )}
    </VStack>
  );
}
