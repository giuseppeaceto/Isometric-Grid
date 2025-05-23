import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { SceneProvider } from './context/SceneContext';
import Layout from './components/layout/Layout';
import IsometricCanvas from './components/canvas/IsometricCanvas';
import Toolbar from './components/controls/Toolbar';
import KeyboardShortcuts from './components/controls/KeyboardShortcuts';

/**
 * Define theme customizations for the application
 * This includes color mode settings and component style overrides
 */
const theme = extendTheme({
  // Color mode configuration
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  // Global styles based on color mode
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  // Component style overrides
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'semibold',
      },
    },
  },
});

/**
 * Main application component
 * 
 * This is the root component of the Isometric Scene Creator application.
 * It sets up the theme provider, scene context, and renders the main layout.
 * 
 * The application structure:
 * - ChakraProvider: Provides UI components and theming
 * - SceneProvider: Manages the state of the isometric scene
 * - Layout: Main layout component containing the UI structure
 * - IsometricCanvas: The canvas where the isometric scene is rendered
 * - Toolbar: Contains tools for manipulating the scene
 * - KeyboardShortcuts: Handles keyboard interactions
 * 
 * @returns {JSX.Element} The rendered application
 */
export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SceneProvider>
        <Layout>
          <IsometricCanvas />
          <Toolbar />
          <KeyboardShortcuts />
        </Layout>
      </SceneProvider>
    </ChakraProvider>
  );
}