import { task } from 'hardhat/config';
import { LensHub__factory } from '../typechain-types';
import { getAddrs, initEnv, waitForTx, ZERO_ADDRESS } from './helpers/utils';

task('whitelist-collector', 'whitelist a collect module').setAction(async ({}, hre) => {
  const [governance, treasury, user] = await initEnv(hre);
  const addrs = getAddrs();
  const multirecipientCollectModuleAddr = addrs['multireciepient collect module'];
  const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

  await waitForTx(lensHub.whitelistCollectModule(multirecipientCollectModuleAddr, true));
  console.log('successfully whitelist collect module');
});
