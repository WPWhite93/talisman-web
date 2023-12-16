import useAssets, { useAssetsFiltered } from '@archetypes/Portfolio/Assets'
import { Crowdloans } from '@archetypes/Wallet'
import { Search } from '@components/Field'
import SectionHeader from '@components/molecules/SectionHeader'
import Asset, { AssetsList, AssetsListLocked } from '@components/recipes/Asset'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import PortfolioAllocationGraph from '@components/widgets/PortfolioAllocationGraph'
import { SelectedAccountsHistory } from '@components/widgets/history/History'
import Stakes from '@components/widgets/staking/Stakes'
import { Eye, EyeOff } from '@talismn/icons'
import { Button, IconButton } from '@talismn/ui'
import { redactBalanceState } from '@talismn/web/src/components/widgets/RedactableBalance'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'

const AssetsOverview = () => {
  const [search, setSearch] = useState('')
  const { fiatTotal } = useAssets()
  const { tokens, balances, isLoading } = useAssetsFiltered({ size: 8, search })

  const lockedAssets = useMemo(
    () =>
      tokens
        ?.filter(token => token.locked)
        ?.map(token => <Asset key={token?.tokenDetails?.id} token={token} balances={balances} lockedAsset />),
    [balances, tokens]
  )

  const [redactBalance, setRedactBalance] = useRecoilState(redactBalanceState)

  return (
    <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1.6rem' }}>
      <section
        css={{
          'width': '100%',
          'display': 'flex',
          'flexDirection': 'column',
          'gap': '1.8rem',

          // last table
          '> table:last-of-type': {
            'display': 'table',

            '@media (min-width: 1024px)': {
              display: 'none',
              height: '620px',
            },
          },
        }}
      >
        <div
          css={{
            'display': 'flex',
            'flexDirection': 'column',
            'justifyContent': 'space-between',
            'alignItems': 'stretch',
            '@media (min-width: 1024px)': {
              flexDirection: 'row',
              alignItems: 'center',
            },
          }}
        >
          <SectionHeader
            headlineText="Assets"
            supportingText={<AnimatedFiatNumber end={fiatTotal} animate={false} />}
            supportingTextIcon={
              <IconButton size="1.25em" onClick={() => setRedactBalance(x => !x)}>
                {redactBalance ? <Eye /> : <EyeOff />}
              </IconButton>
            }
            css={{ marginBottom: 0 }}
          />
          <Search
            placeholder="Search"
            css={{
              'marginTop': '2rem',
              'width': '100%',
              '@media (min-width: 1024px)': {
                margin: 0,
                width: '35%',
              },
            }}
            value={search}
            onChange={setSearch}
          />
        </div>
        <AssetsList isLoading={isLoading}>
          {tokens?.map(token => (
            <Asset key={token?.tokenDetails?.id} token={token} balances={balances} />
          ))}
        </AssetsList>
        {isLoading ||
          (lockedAssets.length > 0 && (
            <AssetsListLocked isLoading={isLoading}>
              {/* tokens but filtered by locked */}
              {lockedAssets}
            </AssetsListLocked>
          ))}
      </section>
      {tokens.length >= 8 && !isLoading ? (
        <Button variant="secondary" css={{ width: 'fit-content' }} as={Link} to="assets">
          View all assets
        </Button>
      ) : (
        <div />
      )}
    </div>
  )
}

const HistoryOverview = () => (
  <div>
    <SectionHeader headlineText="History" />
    <SelectedAccountsHistory maxCount={8} />
    <div css={{ display: 'flex' }}>
      <Button variant="secondary" as={Link} to="history" css={{ marginTop: '1.8rem', marginLeft: 'auto' }}>
        View all history
      </Button>
    </div>
  </div>
)

const Overview = () => (
  <div
    css={{
      'display': 'grid',
      'gap': '4.8rem 2.3rem',
      'gridTemplateRows': 'auto',
      '@media(min-width: 1024px)': {
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gridTemplateAreas: `
          'left right'
          'left right'
          'left right'
        `,
      },
    }}
  >
    <div
      css={{
        'display': 'contents',
        'gridArea': 'left',
        '@media(min-width: 1024px)': {
          display: 'flex',
          flexDirection: 'column',
          gap: '4.8rem',
        },
      }}
    >
      <div css={{ order: 1 }}>
        <ErrorBoundary>
          <AssetsOverview />
        </ErrorBoundary>
      </div>
      <div css={{ order: 4 }}>
        <ErrorBoundary>
          <HistoryOverview />
        </ErrorBoundary>
      </div>
    </div>
    <div
      css={{
        'display': 'contents',
        'gridArea': 'right',
        '@media(min-width: 1024px)': {
          display: 'flex',
          flexDirection: 'column',
          gap: '4.8rem',
        },
      }}
    >
      <div css={{ order: 0 }}>
        <ErrorBoundary>
          <PortfolioAllocationGraph />
        </ErrorBoundary>
      </div>
      <div css={{ order: 2 }}>
        <ErrorBoundary>
          <Stakes />
        </ErrorBoundary>
      </div>
      <div css={{ 'order': 3, ':empty': { display: 'none' } }}>
        <ErrorBoundary>
          <Crowdloans />
        </ErrorBoundary>
      </div>
    </div>
  </div>
)

export default Overview
