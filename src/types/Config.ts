export type { Config }

import type { HeadingDefinition, HeadingDetachedDefinition } from './Heading'

type Config = {
  projectInfo: {
    githubRepository: string
    githubIssues: string
    githubDiscussions?: string
    projectName: string
    projectVersion: string
    discordInvite: string
    twitterProfile: string
  }
  faviconUrl: string
  algolia:
    | null
    | ({
        PENDING_APPROVAL?: true
      } & (
        | {
            appId?: undefined
            apiKey?: undefined
            indexName?: undefined
          }
        | {
            appId: string
            apiKey: string
            indexName: string
          }
      ))
  headings: HeadingDefinition[]
  headingsDetached: HeadingDetachedDefinition[]
  navHeaderMobile: React.ReactNode
  navHeaderMobileWrapperStyle?: React.CSSProperties
  navHeader: React.ReactNode
  navHeaderWrapperStyle?: React.CSSProperties
  tagline: string
  websiteUrl: string
  bannerUrl?: string
  twitterHandle: string
  globalNote?: React.ReactNode
  i18n?: true
  pressKit?: true
  sponsorGithubAccount?: string
}
