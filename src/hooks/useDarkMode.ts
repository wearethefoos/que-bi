import { useMediaQuery } from "./useMediaQuery";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

type DarkModeOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

type DarkModeReturn = boolean;

export function useDarkMode(options: DarkModeOptions = {}): DarkModeReturn {
  const { defaultValue, initializeWithValue = true } = options;

  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY, {
    initializeWithValue,
    defaultValue,
  });

  return isDarkOS;
}
