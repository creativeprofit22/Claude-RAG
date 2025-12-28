import { libraryTheme } from './library.js';
import { cyberpunkTheme } from './cyberpunk.js';
import { brutalistTheme } from './brutalist.js';
import { glassTheme } from './glass.js';
export { libraryTheme } from './library.js';
export { cyberpunkTheme } from './cyberpunk.js';
export { brutalistTheme } from './brutalist.js';
export { glassTheme } from './glass.js';
// Skin to theme mapping
export const chartThemeMap = {
    library: libraryTheme,
    cyberpunk: cyberpunkTheme,
    brutalist: brutalistTheme,
    glass: glassTheme,
};
// Get theme for current skin
export function getChartTheme(skin) {
    return chartThemeMap[skin];
}
//# sourceMappingURL=index.js.map