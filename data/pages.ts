export interface Page {
  id: string,
  title: string,
  url: string,
  parentId?: string
}

const pagesData: Array<Page> = [
  {
    id: 'home',
    title: 'Home',
    url: '/',  
  },
  {
  id: 'dwellingDetails',
  title: 'Dwelling details',
  url: '/dwelling-details',
  parentId: 'home'
}, 
{
  id: 'generalSpecifications',
  title: 'General Specifications',
  url: '/dwelling-details/general-specifications',
  parentId: 'dwellingDetails'
},
{
  id: 'appliancesAndElectricity',
  title: 'Appliances and electricity',
  url: '/dwelling-details/appliances-and-electricity',
  parentId: 'dwellingDetails'
},
]

export default pagesData