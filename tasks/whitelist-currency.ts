import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { ModuleGlobals__factory } from '../typechain-types';
import { getAddrs, initEnv, waitForTx } from './helpers/utils';

task('whitelist-currency', 'whitelists a currency in the module globals')
  .setAction(async ({}, hre) => {
    const [governance, treasury, user] = await initEnv(hre);
    const addrs = getAddrs();
    const globals = addrs['module globals'];
    const currency = addrs['currency'];
    const feeCollectModuleAddr = addrs['fee collect module'];

    const moduleGlobals = ModuleGlobals__factory.connect(globals, governance);

    await waitForTx(moduleGlobals.connect(governance).whitelistCurrency(currency, true));
    console.log(`successfully whitelisted currency ${currency} to address ${feeCollectModuleAddr}`)
  });
