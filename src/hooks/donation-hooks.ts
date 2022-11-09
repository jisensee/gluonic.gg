import { BigNumber } from 'ethers'
import {
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi'

export type Token = 'dai' | 'usdc'
export type DonationType = Token | 'eth'

const addresses: Record<Token, string> = {
  dai: '0x6b175474e89094c44da98b954eedeac495271d0f',
  usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
}

type Address = `0x{string}`

export const useErc20Donation = (token: Token, targetAddress: string) => {
  const { config } = usePrepareContractWrite({
    address: addresses[token],
    abi: erc20ABI,
    functionName: 'transfer',
    args: [targetAddress as Address, BigNumber.from(0)],
  })
  return useContractWrite(config)
}

export const useEthDonation = (targetAddress: string) => {
  const { config } = usePrepareSendTransaction({
    request: { to: targetAddress },
  })
  return useSendTransaction(config)
}

export const useSendDonation = (targetAddress: string) => {
  const { write: sendDai } = useErc20Donation('dai', targetAddress)
  const { write: sendUsdc } = useErc20Donation('usdc', targetAddress)
  const { sendTransaction: sendEth } = useEthDonation(targetAddress)

  return (donationType: DonationType) => {
    if (donationType === 'dai' && sendDai) {
      sendDai()
    } else if (donationType === 'usdc' && sendUsdc) {
      sendUsdc()
    } else if (donationType === 'eth' && sendEth) {
      sendEth()
    }
  }
}
