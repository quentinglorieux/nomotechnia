export const useGlobalState = () => useState('global', () => ({
  sources: [],
  authors: [],
  keywords: [],
  themes: [],
  commentaires: {}
}))

export const useNavState = () => useState('navigation', () => ({
  sourceID: "",
  comID: "",
  navVisibility: true,
  navOpen: false,
  comVisibility: false,
  selectedSourceID: "",
  selectedThemeID: "",
  selectedKeywordID: ""
}))

export const toggleNav = () => {
  const nav = useNavState()
  nav.value.navVisibility = !nav.value.navVisibility
}

export const closeNav = () => {
  const nav = useNavState()
  nav.value.navVisibility = false
}

export const openNav = () => {
  const nav = useNavState()
  nav.value.navVisibility = true
}
