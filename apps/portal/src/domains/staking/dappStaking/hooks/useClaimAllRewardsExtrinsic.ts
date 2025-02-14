import { useExtrinsic } from '../../../common'
import type { Stake } from './useStake'
import type { ApiPromise } from '@polkadot/api'
import { useCallback } from 'react'

export const getAllRewardsClaimExtrinsics = (api: ApiPromise, stake: Stake) =>
  stake.totalRewards.decimalAmount.planck < 0n
    ? []
    : [
        ...(stake.stakerRewards.decimalAmount.planck === 0n
          ? []
          : Array.from({ length: stake.claimableSpanCount }).map(() => api.tx.dappStaking.claimStakerRewards())),
        ...stake.bonusRewards.map(x => api.tx.dappStaking.claimBonusReward(x.dapp)),
      ]

export const useClaimAllRewardsExtrinsic = (stake: Stake) =>
  useExtrinsic(
    useCallback(
      (api: ApiPromise) => {
        const exs = getAllRewardsClaimExtrinsics(api, stake)

        if (exs.length === 0) {
          return undefined
        } else if (exs.length === 1) {
          return exs.at(0)
        } else {
          return api.tx.utility.batchAll(exs)
        }
      },
      [stake]
    )
  )
