import React, { useCallback } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { particlesConfig } from './particles-config';
import { useEffect, useState } from 'react';

const ParticlesBackground: React.FC = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={particlesConfig}
      />
    );
  }

  return <></>;
};

export default ParticlesBackground;

