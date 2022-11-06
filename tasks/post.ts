import { defaultAbiCoder } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { LensHub__factory } from '../typechain-types';
import { PostDataStruct } from '../typechain-types/LensHub';
import { getAddrs, initEnv, waitForTx, ZERO_ADDRESS } from './helpers/utils';
import { BigNumber } from "ethers";

task('post', 'publishes a post').setAction(async ({}, hre) => {
  const [governance, treasury, user] = await initEnv(hre);
  const addrs = getAddrs();
  const treasuryAddress = treasury.address;
  const recipientAddress = addrs['recipient'];
  const multirecipientCollectModuleAddr = addrs['multireciepient collect module'];
  const currency = addrs['currency'];
  const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

  await waitForTx(lensHub.whitelistCollectModule(multirecipientCollectModuleAddr, true));
//   const recipient1 = defaultAbiCoder.encode(
//     ['address', 'uint16'], 
//     [treasuryAddress, 8000]);
//   const recipient2 = defaultAbiCoder.encode(
//     ['address', 'uint16'], 
//     [recipientAddress, 2000]); 
  const recipient1 = {'recipient': treasuryAddress, 'split': 8000};
  const recipient2 = {'recipient': recipientAddress, 'split': 2000};
//   const recipient1 = [treasuryAddress, 8000];
//   const recipient2 = [recipientAddress, 2000];

//   const c = defaultAbiCoder.encode([
//     'uint256','uint96', 'address', 'uint16', 'bool', 'uint72', 'tuple[]'], 
//     [BigNumber.from('1000000000000000000'), 0, currency, 0, false, 0, [recipient1, recipient2]]);

  const inputStruct: PostDataStruct = {
    profileId: 1,
    contentURI: 'https://ipfs.io/ipfs/Qmby8QocUU2sPZL46rZeMctAuF5nrCc7eR1PPkooCztWPz',
    collectModule: multirecipientCollectModuleAddr,
    collectModuleInitData: defaultAbiCoder.encode([
        'tuple(uint256,uint96,address,uint16,bool,uint72,tuple(address, uint16)[])'], 
        [[BigNumber.from('1000000000000000000'), 0, currency, 0, false, 0, [[treasuryAddress, 8000], [recipientAddress, 2000]]]]),
    referenceModule: ZERO_ADDRESS,
    referenceModuleInitData: [],
  };

  await waitForTx(lensHub.connect(user).post(inputStruct));
  console.log(await lensHub.getPub(1, 1));
});
