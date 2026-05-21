import { View, Text, StyleSheet } from "react-native";
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';


export default function Article() {
    const { colors } = useTheme();
    const theme = useTheme()
    const styles = createStyles(theme)
    
    return (
        <View>
            <View>
                <Text style={styles.title}>Titulo</Text>
            </View>
            <View>
                <Text>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse officia deleniti animi temporibus dolores, ex labore soluta id modi nostrum reprehenderit pariatur laborum totam ratione voluptatum. Dolore repellat unde corrupti!
                </Text>
            </View>
        </View>
    )
}

const createStyles = (theme: (typeof themes)['light'] ) => StyleSheet.create({
    title: {
        color: colors.text,
        
    },
})