import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useLocalStorage, useColorScheme } from '@mantine/hooks';
import App from './App';
import './App.css'; // ✅ optional if you have global custom styles

function Main() {
  const preferredColorScheme = useColorScheme(); // Detect system preference
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
  });

  const toggleColorScheme = () =>
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');

  return (
    <MantineProvider
      defaultColorScheme={colorScheme} // ✅ Mantine v7+ now uses this instead of `theme.colorScheme`
      theme={{
        primaryColor: 'indigo',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        headings: { fontFamily: 'Poppins, sans-serif' },
        colors: {
          indigo: [
            '#edf2ff', '#dbe4ff', '#bac8ff', '#91a7ff',
            '#748ffc', '#5c7cfa', '#4c6ef5', '#4263eb',
            '#3b5bdb', '#364fc7',
          ],
          violet: [
            '#f3f0ff', '#e5dbff', '#d0bfff', '#b197fc',
            '#9775fa', '#845ef7', '#7950f2', '#7048e8',
            '#6741d9', '#5f3dc4',
          ],
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications position="top-right" />
      <ModalsProvider>
        <App toggleTheme={toggleColorScheme} />
      </ModalsProvider>
    </MantineProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
