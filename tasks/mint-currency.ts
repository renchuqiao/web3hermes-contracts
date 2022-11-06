import { BigNumber } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { LensHub__factory, CollectNFT__factory, Currency__factory } from '../typechain-types';
import { getAddrs, initEnv, waitForTx } from './helpers/utils';

task('collect', 'collects a post').setAction(async ({}, hre) => {
  const [, , user] = await initEnv(hre);
  const addrs = getAddrs();
  const ONE_CURRENCY = BigNumber.from('1000000000000000000');
  const currencyAddr = addrs['currency'];
  const multireciepientAddr = addrs['multireciepient collect module'];
  const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], user);
  const currency = Currency__factory.connect(currencyAddr, user);
 
  //Approve
  await waitForTx(currency.mint(user.address, ONE_CURRENCY));
  await waitForTx(currency.approve(multireciepientAddr, ONE_CURRENCY));

  await waitForTx(lensHub.collect(1, 1, defaultAbiCoder.encode([
    'address','uint256'],
    [currencyAddr, ONE_CURRENCY])));

  const collectNFTAddr = await lensHub.getCollectNFT(1, 1);
  const collectNFT = CollectNFT__factory.connect(collectNFTAddr, user);

  const publicationContentURI = await lensHub.getContentURI(1, 1);
  const totalSupply = await collectNFT.totalSupply();
  const ownerOf = await collectNFT.ownerOf(1);
  const collectNFTURI = await collectNFT.tokenURI(1);

  console.log(`Collect NFT total supply (should be 1): ${totalSupply}`);
  console.log(
    `Collect NFT owner of ID 1: ${ownerOf}, user address (should be the same): ${user.address}`
  );
  console.log(
    `Collect NFT URI: ${collectNFTURI}, publication content URI (should be the same): ${publicationContentURI}`
  );
});