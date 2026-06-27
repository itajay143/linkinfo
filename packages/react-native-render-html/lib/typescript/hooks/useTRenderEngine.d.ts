import { TRenderEngineConfig } from '../shared-types';
/**
 * Default fallback font for special keys such as 'sans-serif', 'monospace',
 * 'serif', based on current platform.
 */
export declare const defaultFallbackFonts: {
    'sans-serif': string;
    monospace: string;
    serif: string;
};
/**
 * @internal
 */
export default function useTRenderEngine({ allowedStyles, baseStyle, classesStyles, customHTMLElementModels, dangerouslyDisableHoisting, dangerouslyDisableWhitespaceCollapsing, domVisitors, emSize, enableCSSInlineProcessing, enableUserAgentStyles, fallbackFonts, htmlParserOptions, idsStyles, ignoreDomNode, ignoredDomTags, ignoredStyles, selectDomRoot, setMarkersForTNode, systemFonts, tagsStyles }: TRenderEngineConfig): import("@native-html/transient-render-engine").TRenderEngine;
