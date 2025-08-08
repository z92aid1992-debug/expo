import { NativeTabsNavigatorWithContext } from './NativeBottomTabsNavigator';
import { NativeTabTrigger } from './NativeTabTrigger';
import type { NativeTabsProps } from './types';

export const NativeTabs = Object.assign(
  (props: NativeTabsProps) => {
    return <NativeTabsNavigatorWithContext {...props} />;
  },
  { Trigger: NativeTabTrigger }
);
