import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import Stats from "three/addons/libs/stats.module.js";

const LoadingMultipleAssets = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current || !statsRef.current) return;

    // Clear containers
    mountRef.current.innerHTML = "";
    statsRef.current.innerHTML = "";

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(2, 1, -2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.y = 0.75;
    controls.enableDamping = true;

    // Add basic lighting immediately
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Track loaded models
    let modelsLoaded = 0;
    const totalModels = 5; // 1 body + 4 wheels

    // Load HDR environment
    const hdrLoader = new HDRLoader();
    hdrLoader.load(
      "/img/venice_sunset_1k.hdr",
      (texture: THREE.DataTexture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.background = texture;
        (scene.background as any).blurriness = 1.0;
        console.log("HDR loaded successfully");
      },
      undefined,
      (error: unknown) => {
        console.error("Error loading HDR:", error);
        setError("Failed to load HDR environment. Using fallback.");
        // Fallback background
        scene.background = new THREE.Color(0x87ceeb);
      }
    );

    // Create a simple cube as fallback if models fail to load
    const createFallbackModel = () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.7,
        metalness: 0.3,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.y = 0.5;
      scene.add(cube);
      console.log("Created fallback cube");
    };

    // Load GLTF models
    const loader = new GLTFLoader();

    // Load SUV body
    loader.load(
      "/models/suv_body.glb",
      (gltf) => {
        console.log("SUV body loaded");
        scene.add(gltf.scene);
        modelsLoaded++;
        if (modelsLoaded === totalModels) setLoading(false);
      },
      undefined,
      (error: unknown) => {
        console.error("Error loading SUV body:", error);
        setError("Failed to load SUV model. Using fallback.");
        createFallbackModel();
        modelsLoaded++;
        if (modelsLoaded === totalModels) setLoading(false);
      }
    );

    // Wheel positions
    const wheelPositions = [
      { x: -0.65, y: 0.2, z: -0.77, rotate: false },
      { x: 0.65, y: 0.2, z: -0.77, rotate: true },
      { x: -0.65, y: 0.2, z: 0.57, rotate: false },
      { x: 0.65, y: 0.2, z: 0.57, rotate: true },
    ];

    // Load 4 wheels
    wheelPositions.forEach((pos, index) => {
      loader.load(
        "/models/suv_wheel.glb",
        (gltf) => {
          console.log(`Wheel ${index + 1} loaded`);
          gltf.scene.position.set(pos.x, pos.y, pos.z);
          if (pos.rotate) {
            gltf.scene.rotateY(Math.PI);
          }
          scene.add(gltf.scene);
          modelsLoaded++;
          if (modelsLoaded === totalModels) setLoading(false);
        },
        undefined,
        (error: unknown) => {
          console.error(`Error loading wheel ${index + 1}:`, error);
          modelsLoaded++;
          if (modelsLoaded === totalModels) setLoading(false);
        }
      );
    });

    // Create a simple grid for reference
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Stats
    const stats = new Stats();
    statsRef.current.appendChild(stats.dom);

    // Animation loop
    let animationFrameId: number;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      stats.update();
    }
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Remove renderer
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Remove stats
      if (statsRef.current?.contains(stats.dom)) {
        statsRef.current.removeChild(stats.dom);
      }

      // Dispose Three.js resources
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <div
      style={{
        width: "80vw",
        height: "80vh",
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "20px",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
          Loading 3D assets...
        </div>
      )}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "red",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          Warning: {error}
        </div>
      )}
      <div ref={mountRef} style={{ width: "80%", height: "80%" }} />
      <div ref={statsRef} style={{ position: "absolute", top: 0, left: 0 }} />
    </div>
  );
};

export default LoadingMultipleAssets;
