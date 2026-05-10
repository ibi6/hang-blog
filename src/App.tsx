/**
 * Feature: personal-portfolio-blog
 *
 * Application root: composes the theme provider around the router.
 *
 * Requirements: 3.1, 4.1
 */
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";
import { router } from "./router";

export function App(): JSX.Element {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
