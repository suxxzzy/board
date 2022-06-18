import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
html,body{
  box-sizing: border-box;
  margin: 0;
  width: 100%;
  height: 100%;
}
*, *:before, *:after {
  box-sizing: inherit;
}

#root {
  width: 100%;
  height: 100%;
  //border: 3px solid red;
}
`;

export default GlobalStyle;
