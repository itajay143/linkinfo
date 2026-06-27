import { PropsWithChildren, ReactElement } from 'react';
import { RenderHTMLConfig } from './shared-types';
/**
 * A component to provide configuration for {@link RenderHTMLSource}
 * descendants, to be used in conjunction with {@link TRenderEngineProvider}.
 */
export default function RenderHTMLConfigProvider(props: PropsWithChildren<RenderHTMLConfig>): ReactElement;
