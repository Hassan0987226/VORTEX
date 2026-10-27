(() => {
    const canvas = document.getElementById('sceneBackground');
    const THREE = window.THREE;
    if (!canvas || !THREE) return;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'low-power'
        });
    } catch {
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 9;

    scene.add(new THREE.AmbientLight(0x7895aa, 1.5));

    const cyanLight = new THREE.PointLight(0x00d9e8, 24, 12);
    cyanLight.position.set(3.2, 1.8, 3);
    scene.add(cyanLight);

    const pinkLight = new THREE.PointLight(0x9b3c78, 16, 10);
    pinkLight.position.set(-2.5, -1.5, 2);
    scene.add(pinkLight);

    const centerpiece = new THREE.Group();
    centerpiece.position.set(2.8, -0.5, -1.5);
    scene.add(centerpiece);

    const orb = new THREE.Mesh(
        new THREE.SphereGeometry(1.35, 48, 48),
        new THREE.MeshPhysicalMaterial({
            color: 0x124653,
            emissive: 0x06252c,
            emissiveIntensity: 0.7,
            metalness: 0.72,
            roughness: 0.26,
            clearcoat: 0.8,
            transparent: true,
            opacity: 0.62
        })
    );
    centerpiece.add(orb);

    const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x59dce3,
        emissive: 0x08727a,
        emissiveIntensity: 0.45,
        metalness: 0.8,
        roughness: 0.24,
        transparent: true,
        opacity: 0.68
    });

    const ringOne = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.025, 12, 144), ringMaterial);
    ringOne.rotation.set(0.82, 0.15, -0.35);
    centerpiece.add(ringOne);

    const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.018, 10, 128), ringMaterial.clone());
    ringTwo.material.color.setHex(0xe46caa);
    ringTwo.material.emissive.setHex(0x6d153c);
    ringTwo.rotation.set(1.35, -0.5, 0.55);
    centerpiece.add(ringTwo);

    const particleCount = window.innerWidth < 640 ? 260 : 520;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
        particlePositions[index * 3] = (Math.random() - 0.5) * 18;
        particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 11;
        particlePositions[index * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
            color: 0x8ddde2,
            size: 0.022,
            transparent: true,
            opacity: 0.5,
            sizeAttenuation: true,
            depthWrite: false
        })
    );
    scene.add(particles);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Clock();
    let animationFrame;

    function render() {
        const elapsed = clock.getElapsedTime();
        centerpiece.rotation.y = elapsed * 0.08;
        centerpiece.rotation.x = Math.sin(elapsed * 0.12) * 0.05;
        ringOne.rotation.z += reducedMotion ? 0 : 0.0007;
        ringTwo.rotation.y += reducedMotion ? 0 : 0.0005;
        particles.rotation.y = elapsed * 0.006;
        renderer.render(scene, camera);
        if (!reducedMotion) animationFrame = window.requestAnimationFrame(render);
    }

    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', resize);
    render();
})();
