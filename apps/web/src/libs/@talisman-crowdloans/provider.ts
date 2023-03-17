import { selector } from 'recoil'

export type CrowdloanDetail = {
  id: string
  name: string
  image?: string
  headerImage?: string
  token: string
  slug: string
  relayId: string
  paraId: string
  subtitle: string
  info: string
  links: { [key: string]: string }
  customRewards?: {
    title: string
    value: string
  }[]
  rewards: {
    tokens?: string
    info?: string
  }
  bonus: {
    full?: string
    info?: string
    short?: string
  }
}

const crowdloanDataState = selector<CrowdloanDetail[]>({
  key: 'CrowdloanData',
  get: async ({ get }) => {
    const response = await fetch(`https://api.baserow.io/api/database/rows/table/146542/?user_field_names=true`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${process.env.REACT_APP_BASEROW_CROWDLOANS_AUTH}`,
      },
    })
    const data = await response.json()
    const crowdloans = data?.results?.map((crowdloan: any) => {
      const links: { [key: string]: string } = Object.keys(crowdloan).reduce(
        (acc: Record<string, string>, key: string) => {
          if (key.startsWith('links.')) {
            const value = crowdloan[key]
            if (value) {
              const newKey = key
                .replace(/^links\./, '')
                .replace(/-(\w)/g, (_, c) => c.toUpperCase())
                .toLowerCase()
              acc[newKey] = value
            }
          }
          return acc
        },
        {}
      )

      const customRewards = Object.keys(crowdloan)
        .filter(key => key.match(/^rewards\.custom\.\d+\.title$/))
        .filter(titleKey => {
          const valueKey = titleKey.replace('title', 'value')
          return crowdloan[valueKey] !== undefined
        })
        .map(titleKey => {
          const valueKey = titleKey.replace('title', 'value')
          return {
            title: crowdloan[titleKey],
            value: crowdloan[valueKey],
          }
        })
        .filter(reward => reward.title && reward.value)

      return {
        id: crowdloan?.crowdloanId,
        name: crowdloan?.name,
        token: crowdloan?.token,
        slug: crowdloan?.slug,
        relayId: crowdloan?.relayId,
        paraId: crowdloan?.paraId,
        subtitle: crowdloan?.subtitle,
        info: crowdloan?.info,
        links,
        image: crowdloan?.image[0],
        headerImage: crowdloan?.headerImage[0],
        customRewards,
        rewards: {
          tokens: crowdloan?.['rewards.tokens'],
          info: crowdloan?.['rewards.info'],
        },
        bonus: {
          short: crowdloan?.['bonus.short'],
          full: crowdloan?.['bonus.full'],
          info: crowdloan?.['bonus.info'],
        },
      } as CrowdloanDetail
    })

    return crowdloans
  },
})

export default crowdloanDataState
