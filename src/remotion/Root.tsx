import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VslComposition } from './VslComposition';
import { TOTAL_VSL_DURATION_SEC } from './vslData';

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const durationInFrames = Math.round(TOTAL_VSL_DURATION_SEC * fps);

  return (
    <>
      <Composition
        id="VslSecaPeitoral"
        component={VslComposition}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          topHeadline: 'O FIM DA "TETINHA" NESSE VERÃO',
          topSubheadline: 'APP QG SECA PEITORAL • ANTI-AROMATASE',
          ctaButtonText: 'QUERO DESTRAVAR MEU ACESSO AGORA ➔',
          ctaPriceText: 'ACESSO VITALÍCIO POR APENAS R$ 107,90',
          enableJumpCuts: true,
          enableBrolls: true,
          enableCaptions: true,
          enableSfx: false,
          bgmVolume: 0.08,
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
