import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home'
        }}
      />
      <Tabs.Screen
        name='tasks'
        options={{
          title: 'Tasks'
        }}
      />
      <Tabs.Screen
        name='map'
        options={{
          title: 'Map'
        }}
      />
      <Tabs.Screen
        name='meetings'
        options={{
          title: 'Meetings'
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile'
        }}
      />
    </Tabs>

  );
}
