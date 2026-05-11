import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import AccountScreen from '../screens/AccountScreen'
import ServicesScreen from '../screens/ServicesScreen'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HistoryScreen from '../screens/HistoryScreen'

const Tab = createBottomTabNavigator()

export default function MainTabs() {
    return(
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarActiveTintColor: '#1F6AE1',
                tabBarInactiveTintColor: '#999',
                tabBarLabelStyle: {fontSize: 12},
                tabBarIcon: ({color, size}) => {
                    let iconName: string;
                    switch (route.name) {
                        case 'HomeScreen':
                            iconName = 'home'
                            break
                        case 'ServicesScreen':
                            iconName = 'menu'
                            break
                        case 'HistoryScreen':
                            iconName = 'history'
                            break
                        case 'AccountScreen':
                            iconName = 'account-circle'
                            break
                        default:
                            iconName = 'error'
                            break
                    }
                    return <MaterialIcons name={iconName} size={24} color={color} />
                }
            })}
        >
            <Tab.Screen
               name='HomeScreen'
               component={HomeScreen}
               options={{
                title: 'Home',
                headerShown: true,
            }} 
            />
            <Tab.Screen
               name='ServicesScreen'
               component={ServicesScreen}
               options={{title: 'Serviços'}} 
            />
            <Tab.Screen
               name='HistoryScreen'
               component={HistoryScreen}
               options={{title: 'Histórico'}} 
            />
            <Tab.Screen
               name='AccountScreen'
               component={AccountScreen}
               options={{title: 'Conta'}} 
            />
        </Tab.Navigator>
    )
}