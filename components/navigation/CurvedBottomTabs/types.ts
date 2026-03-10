import { ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";

export interface Tab {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface AnimationConfig {
  readonly damping: number;
  readonly stiffness: number;
  readonly mass?: number;
}

export interface ShadowStyle extends Pick<
  ViewStyle,
  | "shadowColor"
  | "shadowOffset"
  | "shadowOpacity"
  | "shadowRadius"
  | "elevation"
> {}

export interface CurvedBottomTabsProps {
  tabs: Tab[];
  currentIndex: number;
  onPress: (index: number, tab: Tab) => void;

  readonly gradient?: string[];
  readonly barHeight?: number;
  readonly buttonScale?: number;
  readonly activeColor?: string;
  readonly inactiveColor?: string;
  readonly labelColor?: string;
  readonly textSize?: number;
  readonly fontFamily?: string;
  readonly hideWhenKeyboardShown?: boolean;
  readonly animation?: AnimationConfig;
  readonly shadow?: ShadowStyle;
}

export interface FloatingButtonComponentProps {
  icon: React.ReactNode;
  tintColor: string;
  readonly gradient: readonly [string, string];
  scale: number;
  shadow: ShadowStyle;
  badge?: number;
}

export interface BackgroundCurveProps {
  position: SharedValue<number>;
  gradient: readonly [string, string];
  height: number;
}

export interface StyleConfig {
  barHeight: number;
  textSize: number;
  readonly fontFamily?: string;
  readonly inactiveColor: string;
  readonly labelColor: string;
}

export type GradientTuple = readonly [string, string];

export interface NavigationState {
  index: number;
  routes: Array<{
    key: string;
    name: string;
    params?: any;
  }>;
}

export interface NavigationDescriptor {
  options: {
    tabBarLabel?: string;
    title?: string;
    tabBarIcon?: (props: {
      focused: boolean;
      color: string;
      size: number;
    }) => React.ReactNode;
    tabBarBadge?: number;
  };
}
export interface CurvedTabBarNavigationProps {
  gradients?: string[];
}
