import {createSystem, defaultConfig, defineConfig} from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: {value: `'Inter', sans-serif`},
        body: {value: `'Inter', sans-serif`},
      },
      colors: {
        lime: {
          50: {value: '#f7fee7'},
          100: {value: '#ecfccb'},
          200: {value: '#d9f99d'},
          300: {value: '#bef264'},
          400: {value: '#a3e635'},
          500: {value: '#84cc16'},
          600: {value: '#65a30d'},
          700: {value: '#4d7c0f'},
          800: {value: '#3f6212'},
          900: {value: '#365314'},
        },
      },
    },
  },
  globalCss: {
    body: {
      backgroundColor: '#ffffff',
      color: '#111827',
    },
  },
})

const theme = createSystem(defaultConfig, config)

export default theme
