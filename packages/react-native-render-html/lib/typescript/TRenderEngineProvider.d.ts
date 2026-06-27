import TRenderEngine from '@native-html/transient-render-engine';
import { PropsWithChildren, ReactElement } from 'react';
import { TRenderEngineConfig } from './shared-types';
/**
 * Use the ambient transient render engine.
 *
 * @returns The ambient transient render engine.
 *
 * @public
 */
export declare function useAmbientTRenderEngine(): TRenderEngine;
/**
 * A react component to share a {@link TRenderEngine} instance across different
 * rendered contents via {@link RenderHTMLSource}. This can significantly enhance
 * performance in applications with potentially dozens or hundreds of distinct
 * rendered snippets such as chat apps.
 *
 * @param props - Pass engine config here.
 */
export default function TRenderEngineProvider({ children, ...config }: PropsWithChildren<TRenderEngineConfig>): ReactElement;
