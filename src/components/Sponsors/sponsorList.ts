export { sponsorList }

import type { Sponsor } from '../Sponsors'
import ccoliLogo from './companyLogos/ccoli.svg'
import contraLogo from './companyLogos/contra.svg'
import mfqsLogo from './companyLogos/mfqs.svg'
import reporaLogo from './companyLogos/repora.svg'

const sponsorList: Sponsor[] = [
  {
    companyName: 'Contra',
    companyLogo: contraLogo,
    plan: 'gold',
    website: 'https://contra.com'
  },
  {
    companyName: 'ccoli',
    companyLogo: ccoliLogo,
    plan: 'silver',
    website: 'https://ccoli.co'
  },
  {
    companyName: 'My Favorite Quilt Store',
    companyLogo: mfqsLogo,
    plan: 'bronze',
    website: 'https://myfavoritequiltstore.com'
  },
  {
    companyName: 'Repora',
    companyLogo: reporaLogo,
    plan: 'bronze',
    website: 'https://www.repora.com'
  },
  {
    username: 'DannyZB'
  },
  {
    username: 'pieperz'
  },
  {
    username: 'hemengke1997'
  },
  {
    username: 'spacedawwwg'
  },
  {
    username: 'arthurgailes'
  },
  {
    username: 'stackblitz'
  },
  {
    username: 'codthing'
  },
  {
    username: 'Junaidhkn'
  },
  {
    username: 'zgfdev'
  }
]
