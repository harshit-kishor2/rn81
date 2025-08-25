import AppButton from '@app/components/common/AppButton';
import AppContainer from '@app/components/common/AppContainer';
import AppLottie from '@app/components/common/AppLottie';
import AppSvg from '@app/components/common/AppSvg';
import AppText from '@app/components/common/AppText';
import ASSETS from '@app/constants/assets';
import '@app/i18n/i18n-config';
import { _SVG_ICONS } from '@assets/svgs';
import React from 'react';
import RootWrapper from './RootWrapper';
import AppFastImage from '@app/components/common/AppFastImage';
import AppWebview from '@app/components/common/AppWebview';

const EntryFile = () => {
  return (
    <RootWrapper>
      <AppContainer>
        <AppText variant="h5">Entry File</AppText>
        <AppButton title="Click Me" width={'90%'} />
        <AppSvg icon={_SVG_ICONS.APP} />
        <AppLottie
          source={ASSETS.ANIMATIONS.LOADER}
          style={{ width: 100, height: 100 }}
        />
        <AppFastImage
          source={ASSETS.IMAGES.APP_LOGO}
          style={{ width: 100, height: 100 }}
        />
        <AppWebview url="https://reactnative.dev" />
      </AppContainer>
    </RootWrapper>
  );
};

export default EntryFile;
