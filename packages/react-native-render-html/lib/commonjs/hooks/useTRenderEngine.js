"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useTRenderEngine;
exports.defaultFallbackFonts = void 0;

var _react = require("react");

var _reactNative = require("react-native");

var _buildTREFromConfig = _interopRequireDefault(require("../helpers/buildTREFromConfig"));

var _useProfiler = _interopRequireDefault(require("./useProfiler"));

var _defaultSystemFonts = _interopRequireDefault(require("../defaultSystemFonts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Default fallback font for special keys such as 'sans-serif', 'monospace',
 * 'serif', based on current platform.
 */
const defaultFallbackFonts = {
  'sans-serif': _reactNative.Platform.select({
    ios: 'system',
    default: 'sans-serif'
  }),
  monospace: _reactNative.Platform.select({
    ios: 'Menlo',
    default: 'monospace'
  }),
  serif: _reactNative.Platform.select({
    ios: 'Times New Roman',
    default: 'serif'
  })
};
exports.defaultFallbackFonts = defaultFallbackFonts;
const defaultConfig = {
  baseStyle: {
    fontSize: 14
  },
  classesStyles: {},
  customHTMLElementModels: {},
  emSize: 14,
  enableCSSInlineProcessing: true,
  enableUserAgentStyles: true,
  fallbackFonts: defaultFallbackFonts,
  htmlParserOptions: {
    decodeEntities: true
  },
  ignoredDomTags: [],
  ignoredStyles: [],
  systemFonts: _defaultSystemFonts.default,
  tagsStyles: {}
};
/**
 * @internal
 */

function useTRenderEngine({
  allowedStyles,
  baseStyle = defaultConfig.baseStyle,
  classesStyles = defaultConfig.classesStyles,
  customHTMLElementModels = defaultConfig.customHTMLElementModels,
  dangerouslyDisableHoisting,
  dangerouslyDisableWhitespaceCollapsing,
  domVisitors,
  emSize = defaultConfig.emSize,
  enableCSSInlineProcessing = defaultConfig.enableCSSInlineProcessing,
  enableUserAgentStyles = defaultConfig.enableUserAgentStyles,
  fallbackFonts = defaultConfig.fallbackFonts,
  htmlParserOptions = defaultConfig.htmlParserOptions,
  idsStyles,
  ignoreDomNode,
  ignoredDomTags = defaultConfig.ignoredDomTags,
  ignoredStyles = defaultConfig.ignoredStyles,
  selectDomRoot,
  setMarkersForTNode,
  systemFonts = defaultConfig.systemFonts,
  tagsStyles = defaultConfig.tagsStyles
}) {
  const profile = (0, _useProfiler.default)({
    name: 'TRenderEngineProvider'
  });
  return (0, _react.useMemo)(() => {
    typeof __DEV__ === 'boolean' && __DEV__ && profile();
    return (0, _buildTREFromConfig.default)({
      allowedStyles,
      baseStyle,
      classesStyles,
      customHTMLElementModels,
      dangerouslyDisableHoisting,
      dangerouslyDisableWhitespaceCollapsing,
      domVisitors,
      emSize,
      enableCSSInlineProcessing,
      enableUserAgentStyles,
      fallbackFonts,
      htmlParserOptions,
      idsStyles,
      ignoreDomNode,
      ignoredDomTags,
      ignoredStyles,
      selectDomRoot,
      setMarkersForTNode,
      systemFonts,
      tagsStyles
    });
  }, [profile, allowedStyles, baseStyle, classesStyles, customHTMLElementModels, dangerouslyDisableHoisting, dangerouslyDisableWhitespaceCollapsing, domVisitors, emSize, enableCSSInlineProcessing, enableUserAgentStyles, fallbackFonts, htmlParserOptions, idsStyles, ignoreDomNode, ignoredDomTags, ignoredStyles, selectDomRoot, setMarkersForTNode, systemFonts, tagsStyles]);
}
//# sourceMappingURL=useTRenderEngine.js.map