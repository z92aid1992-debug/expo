import React from 'react';
import { Button, View } from 'react-native';
import { BottomTabsScreen as _BottomTabsScreen } from 'react-native-screens';

import { NativeTabs, NativeTabTrigger, NativeTabOptions } from '../..';
import { screen, renderRouter, act, fireEvent } from '../../../testing-library';
import { Badge, Icon, Label } from '../../common/elements';

jest.mock('react-native-screens', () => {
  const { View }: typeof import('react-native') = jest.requireActual('react-native');
  return {
    ...(jest.requireActual('react-native-screens') as typeof import('react-native-screens')),
    BottomTabs: jest.fn(({ children }) => <View testID="BottomTabs">{children}</View>),
    BottomTabsScreen: jest.fn(({ children }) => <View testID="BottomTabsScreen">{children}</View>),
  };
});

const BottomTabsScreen = _BottomTabsScreen as jest.MockedFunction<typeof _BottomTabsScreen>;

it('can pass options via options prop', () => {
  const indexOptions: NativeTabOptions = {
    title: 'Test Title',
    tabBarItemIconColor: 'blue',
  };
  const secondOptions: NativeTabOptions = {
    title: 'Second Title',
    tabBarItemIconColor: 'red',
  };
  renderRouter({
    _layout: () => (
      <NativeTabs>
        <NativeTabTrigger name="index" options={{ ...indexOptions }} />
        <NativeTabTrigger name="second" options={{ ...secondOptions }} />
      </NativeTabs>
    ),
    index: () => <View testID="index" />,
    second: () => <View testID="second" />,
  });

  expect(screen.getByTestId('index')).toBeVisible();
  expect(screen.getByTestId('second')).toBeVisible();
  expect(BottomTabsScreen).toHaveBeenCalledTimes(2);
  expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
    ...indexOptions,
  });
  expect(BottomTabsScreen.mock.calls[1][0]).toMatchObject({
    ...secondOptions,
  });
});

it('can pass options via elements', () => {
  renderRouter({
    _layout: () => (
      <NativeTabs>
        <NativeTabTrigger name="index">
          <Icon sf="homepod.2.fill" />
        </NativeTabTrigger>
      </NativeTabs>
    ),
    index: () => <View testID="index" />,
  });

  expect(screen.getByTestId('index')).toBeVisible();
  expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
  expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
    icon: { sfSymbolName: 'homepod.2.fill' },
    selectedIcon: undefined,
  } as NativeTabOptions);
});

it('when no options are passed, default ones are used', () => {
  const { BottomTabsScreen } = require('react-native-screens');
  renderRouter({
    _layout: () => (
      <NativeTabs>
        <NativeTabTrigger name="index" />
      </NativeTabs>
    ),
    index: () => <View testID="index" />,
  });

  expect(screen.getByTestId('index')).toBeVisible();
  expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
  expect(Object.keys(BottomTabsScreen.mock.calls[0][0])).toEqual([
    'hidden',
    'specialEffects',
    'iconResourceName',
    'icon',
    'selectedIcon',
    'title',
    'tabKey',
    'isFocused',
    'children',
  ]);
  expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
    hidden: false,
    specialEffects: {},
    tabKey: expect.stringMatching(/^index-[-\w]+/),
    isFocused: true,
    children: expect.objectContaining({}),
  } as NativeTabOptions);
});

describe('Icons', () => {
  it('when using Icon with sf prop, it is passed as sfSymbolName', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Icon sf="homepod.2.fill" />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      icon: { sfSymbolName: 'homepod.2.fill' },
    } as NativeTabOptions);
  });

  it('when using Icon with selectedSf prop, it is passed as selected icon sfSymbolName', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Icon selectedSf="homepod.2.fill" />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      selectedIcon: { sfSymbolName: 'homepod.2.fill' },
    } as NativeTabOptions);
  });

  it('when using Icon with sf and selectedSf, values are passed correctly', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Icon sf="stairs" selectedSf="star.bubble" />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      selectedIcon: { sfSymbolName: 'star.bubble' },
      icon: { sfSymbolName: 'stairs' },
    } as NativeTabOptions);
  });

  it('when using Icon drawable on iOS, no value is passed', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Icon drawable="stairs" />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0].icon).toBeUndefined();
    expect(BottomTabsScreen.mock.calls[0][0].selectedIcon).toBeUndefined();
    expect(BottomTabsScreen.mock.calls[0][0].iconResourceName).toBeUndefined();
  });

  it('uses last Icon sf value when multiple are provided', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Icon sf="stairs" />
            <Icon sf="homepod.2.fill" />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      icon: { sfSymbolName: 'homepod.2.fill' },
      selectedIcon: undefined,
    } as NativeTabOptions);
  });

  it('uses last Icon selectedSf when multiple are provided', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Icon selectedSf="stairs" />
            <Icon selectedSf="homepod.2.fill" />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      selectedIcon: { sfSymbolName: 'homepod.2.fill' },
    } as NativeTabOptions);
  });

  it('uses last Icon sf and selectedSf for each type when multiple are provided', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Icon sf="stairs" selectedSf="star.bubble" />
            <Icon sf="homepod.2.fill" selectedSf="homepod.2.fill" />
            <Icon sf="0.circle.ar" />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      selectedIcon: undefined,
      icon: { sfSymbolName: '0.circle.ar' },
    } as NativeTabOptions);
  });

  it('uses last Icon sf and selectedSf for each type when multiple are provided', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Icon sf="stairs" selectedSf="star.bubble" />
            <Icon sf="homepod.2.fill" selectedSf="homepod.2.fill" />
            <Icon selectedSf="0.circle.ar" />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      selectedIcon: { sfSymbolName: '0.circle.ar' },
      icon: undefined,
    } as NativeTabOptions);
  });
});

describe('Badge', () => {
  it('passes badge value via Badge element', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Badge>5</Badge>
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      badgeValue: '5',
    } as NativeTabOptions);
  });

  it('passes badge value as string', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Badge>New</Badge>
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      badgeValue: 'New',
    } as NativeTabOptions);
  });

  it('does not pass badge when Badge is not used', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index" />
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).not.toHaveProperty('badgeValue');
  });

  it('uses last Badge value when multiple are provided', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Badge>1</Badge>
            <Badge>2</Badge>
            <Badge>3</Badge>
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      badgeValue: '3',
    } as NativeTabOptions);
  });

  it('when empty Badge is used, passes space to badgeValue', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Badge />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0].badgeValue).toBe(' '); // Space is used to show empty badge
  });

  it('when empty Badge is used with hidden, passes undefined to badgeValue', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Badge hidden />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0].badgeValue).toBeUndefined();
  });
});

describe('Title', () => {
  it('passes title via Title element', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Label>Custom Title</Label>
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      title: 'Custom Title',
    } as NativeTabOptions);
  });

  it('when title is not set, uses the route name', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index" />
          <NativeTabTrigger name="one" />
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
      one: () => <View testID="one" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(screen.getByTestId('one')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(2);
    expect(BottomTabsScreen.mock.calls[0][0].title).toBe('index');
    expect(BottomTabsScreen.mock.calls[1][0].title).toBe('one');
  });

  it('uses last Title value when multiple are provided', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Label>First Title</Label>
            <Label>Second Title</Label>
            <Label>Last Title</Label>
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      title: 'Last Title',
    } as NativeTabOptions);
  });

  it('when empty Label is used, passes route name to title', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Label />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0].title).toBe('index'); // Route name is used as title when Label is empty
  });

  it('when Label with hidden is used, passes empty string to title', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Label hidden />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0].title).toBe(''); // Route name is used as title when Label is empty
  });
});

describe('Tab options', () => {
  describe('disablePopToTop', () => {
    it('When disablePopToTop is true, popToRoot is false', () => {
      renderRouter({
        _layout: () => (
          <NativeTabs>
            <NativeTabTrigger name="index" disablePopToTop>
              <Label>Custom Title</Label>
            </NativeTabTrigger>
          </NativeTabs>
        ),
        index: () => <View testID="index" />,
      });

      expect(screen.getByTestId('index')).toBeVisible();
      expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
      expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
        specialEffects: {
          repeatedTabSelection: {
            popToRoot: false,
          },
        },
      } as NativeTabOptions);
    });

    it('When disablePopToTop is not set or false, popToRoot is true', () => {
      renderRouter({
        _layout: () => (
          <NativeTabs>
            <NativeTabTrigger name="index">
              <Label>Custom Title</Label>
            </NativeTabTrigger>
            <NativeTabTrigger name="one" disablePopToTop={false}>
              <Label>One</Label>
            </NativeTabTrigger>
          </NativeTabs>
        ),
        index: () => <View testID="index" />,
        one: () => <View testID="one" />,
      });

      expect(screen.getByTestId('index')).toBeVisible();
      expect(BottomTabsScreen).toHaveBeenCalledTimes(2);
      expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
        title: 'Custom Title',
        specialEffects: {
          repeatedTabSelection: {
            popToRoot: true,
          },
        },
      } as NativeTabOptions);
      expect(BottomTabsScreen.mock.calls[1][0]).toMatchObject({
        title: 'One',
        specialEffects: {
          repeatedTabSelection: {
            popToRoot: true,
          },
        },
      } as NativeTabOptions);
    });
  });

  describe('disableScrollToTop', () => {
    it('When disableScrollToTop is true, scrollToTop is false', () => {
      renderRouter({
        _layout: () => (
          <NativeTabs>
            <NativeTabTrigger name="index" disableScrollToTop>
              <Label>Custom Title</Label>
            </NativeTabTrigger>
          </NativeTabs>
        ),
        index: () => <View testID="index" />,
      });

      expect(screen.getByTestId('index')).toBeVisible();
      expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
      expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
        specialEffects: {
          repeatedTabSelection: {
            scrollToTop: false,
          },
        },
      } as NativeTabOptions);
    });

    it('When disableScrollToTop is not set or false, scrollToTop is true', () => {
      renderRouter({
        _layout: () => (
          <NativeTabs>
            <NativeTabTrigger name="index">
              <Label>Custom Title</Label>
            </NativeTabTrigger>
            <NativeTabTrigger name="one" disableScrollToTop={false}>
              <Label>One</Label>
            </NativeTabTrigger>
          </NativeTabs>
        ),
        index: () => <View testID="index" />,
        one: () => <View testID="one" />,
      });

      expect(screen.getByTestId('index')).toBeVisible();
      expect(BottomTabsScreen).toHaveBeenCalledTimes(2);
      expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
        title: 'Custom Title',
        specialEffects: {
          repeatedTabSelection: {
            scrollToTop: true,
          },
        },
      } as NativeTabOptions);
      expect(BottomTabsScreen.mock.calls[1][0]).toMatchObject({
        title: 'One',
        specialEffects: {
          repeatedTabSelection: {
            scrollToTop: true,
          },
        },
      } as NativeTabOptions);
    });
  });
});

describe('Dynamic options', () => {
  it('updates options dynamically', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index" options={{ title: 'Initial Title' }} />
        </NativeTabs>
      ),
      index: () => (
        <View testID="index">
          <NativeTabTrigger name="index" options={{ title: 'Updated Title' }} />
        </View>
      ),
    });
    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(2);
    expect(Object.keys(BottomTabsScreen.mock.calls[0][0])).toEqual([
      'title',
      'hidden',
      'specialEffects',
      'iconResourceName',
      'icon',
      'selectedIcon',
      'tabKey',
      'isFocused',
      'children',
    ]);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      title: 'Initial Title',
      hidden: false,
      specialEffects: {},
      tabKey: expect.stringMatching(/^index-[-\w]+/),
      isFocused: true,
      children: expect.objectContaining({}),
    } as NativeTabOptions);
    expect(BottomTabsScreen.mock.calls[1][0]).toMatchObject({
      title: 'Updated Title',
      hidden: false,
      specialEffects: {},
      tabKey: expect.stringMatching(/^index-[-\w]+/),
      isFocused: true,
      children: expect.objectContaining({}),
    } as NativeTabOptions);
  });

  it('can use components as children', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index" options={{ title: 'Initial Title' }} />
        </NativeTabs>
      ),
      index: () => (
        <View testID="index">
          <NativeTabTrigger name="index">
            <Label>Updated Title</Label>
            <Badge>5</Badge>
            <Icon sf="homepod.2.fill" />
          </NativeTabTrigger>
        </View>
      ),
    });
    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(2);
    expect(Object.keys(BottomTabsScreen.mock.calls[0][0])).toEqual([
      'title',
      'hidden',
      'specialEffects',
      'iconResourceName',
      'icon',
      'selectedIcon',
      'tabKey',
      'isFocused',
      'children',
    ]);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      title: 'Initial Title',
      hidden: false,
      specialEffects: {},
      tabKey: expect.stringMatching(/^index-[-\w]+/),
      isFocused: true,
    } as NativeTabOptions);
    expect(BottomTabsScreen.mock.calls[1][0]).toMatchObject({
      title: 'Updated Title',
      hidden: false,
      specialEffects: {},
      tabKey: expect.stringMatching(/^index-[-\w]+/),
      isFocused: true,
      badgeValue: '5',
      icon: {
        sfSymbolName: 'homepod.2.fill',
      },
    } as NativeTabOptions);
  });

  it('can override component children from _layout with options', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Label>Initial Title</Label>
            <Badge>3</Badge>
            <Icon sf="0.circle" />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => (
        <View testID="index">
          <NativeTabTrigger
            name="index"
            options={{
              title: 'Updated Title',
              badgeValue: '5',
              icon: { sf: 'homepod.2.fill' },
            }}
          />
        </View>
      ),
    });
    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(2);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      title: 'Initial Title',
      badgeValue: '3',
      icon: { sfSymbolName: '0.circle' },
      hidden: false,
      specialEffects: {},
      tabKey: expect.stringMatching(/^index-[-\w]+/),
      isFocused: true,
    } as NativeTabOptions);
    expect(BottomTabsScreen.mock.calls[1][0]).toMatchObject({
      title: 'Updated Title',
      hidden: false,
      specialEffects: {},
      tabKey: expect.stringMatching(/^index-[-\w]+/),
      isFocused: true,
      badgeValue: '5',
      icon: {
        sfSymbolName: 'homepod.2.fill',
      },
    } as NativeTabOptions);
  });

  it('can override component children from _layout with dynamic children', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Label>Initial Title</Label>
            <Badge>3</Badge>
            <Icon sf="0.circle" />
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: () => (
        <View testID="index">
          <NativeTabTrigger name="index">
            <Label>Updated Title</Label>
            <Badge>5</Badge>
            <Icon sf="homepod.2.fill" />
          </NativeTabTrigger>
        </View>
      ),
    });
    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(2);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      title: 'Initial Title',
      badgeValue: '3',
      icon: { sfSymbolName: '0.circle' },
      hidden: false,
      specialEffects: {},
      tabKey: expect.stringMatching(/^index-[-\w]+/),
      isFocused: true,
    } as NativeTabOptions);
    expect(BottomTabsScreen.mock.calls[1][0]).toMatchObject({
      title: 'Updated Title',
      hidden: false,
      specialEffects: {},
      tabKey: expect.stringMatching(/^index-[-\w]+/),
      isFocused: true,
      badgeValue: '5',
      icon: {
        sfSymbolName: 'homepod.2.fill',
      },
    } as NativeTabOptions);
  });

  it('can dynamically update options with state update', () => {
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabTrigger name="index">
            <Label>Initial Title</Label>
          </NativeTabTrigger>
        </NativeTabs>
      ),
      index: function Index() {
        const [value, setValue] = React.useState(0);
        const label = `Updated Title ${value}`;
        return (
          <View testID="index">
            <NativeTabTrigger name="index">
              <Label>{label}</Label>
            </NativeTabTrigger>
            <Button title="Update" testID="update-button" onPress={() => setValue((v) => v + 1)} />
          </View>
        );
      },
    });
    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(2);
    expect(BottomTabsScreen.mock.calls[0][0].title).toBe('Initial Title');
    expect(BottomTabsScreen.mock.calls[1][0].title).toBe('Updated Title 0');
    act(() => fireEvent.press(screen.getByTestId('update-button')));
    expect(BottomTabsScreen).toHaveBeenCalledTimes(3);
    expect(BottomTabsScreen.mock.calls[2][0].title).toBe('Updated Title 1');
    act(() => fireEvent.press(screen.getByTestId('update-button')));
    expect(BottomTabsScreen).toHaveBeenCalledTimes(4);
    expect(BottomTabsScreen.mock.calls[3][0].title).toBe('Updated Title 2');
  });
});
