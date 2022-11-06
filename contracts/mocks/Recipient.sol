// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

contract Recipient {
    function getBalance() public view returns (uint256) {
        return this.getBalance();
    }
}