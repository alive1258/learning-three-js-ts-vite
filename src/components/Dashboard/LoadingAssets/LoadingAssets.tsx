import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

const LoadingAssets = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || !statsRef.current) return;

    // Clear any existing content
    mountRef.current.innerHTML = "";
    statsRef.current.innerHTML = "";

    // Scene setup
    const scene = new THREE.Scene();

    // URLs for assets
    const hdr = "https://sbcode.net/img/venice_sunset_1k.hdr";
    const image = "https://sbcode.net/img/grid.png";
    const model = "https://sbcode.net/models/suzanne_no_material.glb";

    // Alternative URLs (commented out as in original)
    // const hdr = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/equirectangular/venice_sunset_1k.hdr'
    // const image = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/uv_grid_opengl.jpg'
    // const model = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Xbot.glb'

    // Load HDR environment
    const hdrLoader = new HDRLoader();
    hdrLoader.load(
      hdr,
      (texture: THREE.DataTexture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.background = texture;
      },
      undefined,
      (error: unknown) => {
        console.error("Error loading HDR:", error);
      }
    );

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(-2, 0.5, 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Handle resize
    const handleResize = () => {
      camera.aspect =
        mountRef.current!.clientWidth / mountRef.current!.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current!.clientWidth,
        mountRef.current!.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Material and texture
    const material = new THREE.MeshStandardMaterial();
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      image,
      (texture: THREE.Texture) => {
        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      (error: unknown) => {
        console.error("Error loading texture:", error);
      }
    );

    // Create plane
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    scene.add(plane);

    // Load GLTF model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      model,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material;
          }
        });
        scene.add(gltf.scene);
      },
      undefined,
      (error: unknown) => {
        console.error("Error loading model:", error);
      }
    );

    // Add some lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Stats
    const stats = new Stats();
    if (statsRef.current) {
      statsRef.current.appendChild(stats.dom);
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      stats.update();
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      if (statsRef.current && statsRef.current.contains(stats.dom)) {
        statsRef.current.removeChild(stats.dom);
      }

      // Dispose Three.js resources
      renderer.dispose();

      if (material.map) {
        material.map.dispose();
      }
      material.dispose();
      planeGeometry.dispose();

      controls.dispose();
    };
  }, []);

  return (
    <div
      style={{
        width: "80vw",
        height: "90vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000000",
      }}
    >
      <div ref={mountRef} style={{ width: "80%", height: "90%" }} />
      <div ref={statsRef} style={{ position: "absolute", top: 0, left: 0 }} />
    </div>
  );
};

export default LoadingAssets;
