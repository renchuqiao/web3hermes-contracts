import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';
import { Currency__factory } from '../typechain-types';
import { getAddrs, initEnv, waitForTx } from './helpers/utils';

task('mint-currency', 'mint currency for users').setAction(async ({}, hre) => {
  const [, , user] = await initEnv(hre);
  const addrs = getAddrs();
  const ONE_CURRENCY = BigNumber.from('1000000000000000000');
  const currencyAddr = addrs['currency'];
  const multireciepientAddr = addrs['multireciepient collect module'];
  const currency = Currency__factory.connect(currencyAddr, user);
 
  //Approve
  await waitForTx(currency.mint(user.address, ONE_CURRENCY));
  await waitForTx(currency.approve(multireciepientAddr, ONE_CURRENCY));

  console.log('minted and approved 1 token');
});