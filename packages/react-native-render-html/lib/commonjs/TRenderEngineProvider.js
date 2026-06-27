"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAmbientTRenderEngine = useAmbientTRenderEngine;
exports.default = TRenderEngineProvider;

var _react = _interopRequireDefault(require("react"));

var _useTRenderEngine = _interopRequireDefault(require("./hooks/useTRenderEngine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultTRenderEngine = {};

const TRenderEngineContext = /*#__PURE__*/_react.default.createContext(defaultTRenderEngine);
/**
 * Use the ambient transient render engine.
 *
 * @returns The ambient transient render engine.
 *
 * @public
 */


function useAmbientTRenderEngine() {
  const engine = _react.default.useContext(TRenderEngineContext);

  if (typeof __DEV__ === 'boolean' && __DEV__ && engine === defaultTRenderEngine) {
    console.error('TRenderEngineProvider is missing in the render tree.');
  }

  return engine;
}
/**
 * A react component to share a {@link TRenderEngine} instance across different
 * rendered contents via {@link RenderHTMLSource}. This can significantly enhance
 * performance in applications with potentially dozens or hundreds of distinct
 * rendered snippets such as chat apps.
 *
 * @param props - Pass engine config here.
 */


function TRenderEngineProvider({
  children,
  ...config
}) {
  const engine = (0, _useTRenderEngine.default)(config);
  return /*#__PURE__*/_react.default.createElement(TRenderEngineContext.Provider, {
    value: engine
  }, children);
}
//# sourceMappingURL=TRenderEngineProvider.js.map