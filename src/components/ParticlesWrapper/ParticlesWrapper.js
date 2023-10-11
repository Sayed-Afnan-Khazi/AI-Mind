import React from 'react';
import './ParticlesWrapper';

// React TSParticles
import { useCallback } from 'react';
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
const particlesOptions = {
                fpsLimit: 120,
                interactivity: {
                    events: {
                        // onClick: {
                        //     enable: true,
                        //     mode: "push",
                        // },
                        // onHover: {
                        //     enable: true,
                        //     mode: "repulse",
                        // },
                        // resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#32a4a8",
                    },
                    links: {
                        color: "#32a8a4",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 6,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 70,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }

const ParticlesWrapper = () => {
	// Method needed for particles to work
    const init = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

	return (
			<Particles options={particlesOptions} init={init} />
    )
}

export default ParticlesWrapper;