import { IconCalendar, IconList, IconMore } from '@assets/icons';
import { useThemeColor } from '@shared/lib/theme';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MainLayout() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: ({ children, style, ...props }) => (
          <Pressable
            onPress={props.onPress}
            onLongPress={props.onLongPress}
            testID={props.testID}
            accessibilityLabel={props.accessibilityLabel}
            accessibilityState={props.accessibilityState}
            accessibilityRole="button"
            style={[
              style,
              {
                flex: 1,
                margin: 0,
                padding: 0,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            {children}
          </Pressable>
        ),
        tabBarStyle: {
          position: 'absolute',
          marginLeft: 16,
          bottom: bottom + 24,
          height: 56,
          width: 168, // pill 너비
          borderRadius: 32,
          backgroundColor: colors.fill.normal,
          borderTopWidth: 0,
          elevation: 6,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconCalendar
              width={24}
              height={24}
              color={focused ? colors.icon.normal : colors.icon.alternative}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="diary-list"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconList
              width={24}
              height={24}
              color={focused ? colors.icon.normal : colors.icon.alternative}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconMore
              width={24}
              height={24}
              color={focused ? colors.icon.normal : colors.icon.alternative}
            />
          ),
        }}
      />
    </Tabs>
  );
}
