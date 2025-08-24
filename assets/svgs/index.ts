import {SvgProps} from 'react-native-svg';
import APP_ICON from './app.svg';
import ARROW_DOWN_ICON from './arrow_down.svg';
import ARROW_LEFT_ICON from './arrow_left.svg';
import ARROW_RIGHT_ICON from './arrow_right.svg';
import ARROW_UP_ICON from './arrow_up.svg';

export enum _SVG_ICONS {
  APP = 'APP',
  ARROW_DOWN = 'ARROW_DOWN',
  ARROW_LEFT = 'ARROW_LEFT',
  ARROW_RIGHT = 'ARROW_RIGHT',
  ARROW_UP = 'ARROW_UP',
}

export const _SVG_ICONS_MAP: Record<_SVG_ICONS, React.FC<SvgProps>> = {
  [_SVG_ICONS.APP]: APP_ICON,
  [_SVG_ICONS.ARROW_DOWN]: ARROW_DOWN_ICON,
  [_SVG_ICONS.ARROW_LEFT]: ARROW_LEFT_ICON,
  [_SVG_ICONS.ARROW_RIGHT]: ARROW_RIGHT_ICON,
  [_SVG_ICONS.ARROW_UP]: ARROW_UP_ICON,
};
