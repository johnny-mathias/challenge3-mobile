import { PropsWithChildren, createContext, useContext } from 'react'
import { useColorScheme } from 'react-native'
import { themes } from './theme'

const ThemeContext = createContext(themes.light)

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const scheme = useColorScheme()
    const theme = scheme === 'dark' ? themes.dark : themes.light

    return(
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
