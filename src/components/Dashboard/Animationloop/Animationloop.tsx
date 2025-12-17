import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

const AnimationLoop = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const statsRef = useRef<Stats | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const hoveredRef = useRef<boolean>(false);
  const animationFrameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0e12); // Dark background
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 1.5;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Create cube with hover effects
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial({
      wireframe: false, // Solid cube
      transparent: true,
      opacity: 0.8,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.userData.isHovered = false;
    scene.add(cube);
    cubeRef.current = cube;

    // Add edges/wireframe overlay
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    cube.add(wireframe);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Initialize raycaster for mouse interactions
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // Initialize Stats.js
    const stats = new Stats();
    stats.dom.style.position = "absolute";
    stats.dom.style.top = "0px";
    stats.dom.style.left = "0px";
    containerRef.current.appendChild(stats.dom);
    statsRef.current = stats;

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      // Calculate mouse position in normalized device coordinates
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x =
        ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 -
        1;
      mouseRef.current.y =
        -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 +
        1;
    };

    // Click handler
    const handleClick = () => {
      if (cubeRef.current && cubeRef.current.userData.isHovered) {
        // Change color on click
        if (cubeRef.current.material instanceof THREE.MeshNormalMaterial) {
          // Create a random color

          // Reset color after 1 second
          setTimeout(() => {
            if (cubeRef.current?.material instanceof THREE.MeshNormalMaterial) {
            }
          }, 1000);
        }
      }
    };

    // Mouse enter/leave handlers
    const handleMouseEnter = () => {
      document.body.style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      document.body.style.cursor = "default";
    };

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current)
        return;

      cameraRef.current.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    // Add event listeners
    containerRef.current.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("click", handleClick);
    containerRef.current.addEventListener("mouseenter", handleMouseEnter);
    containerRef.current.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (cubeRef.current) {
        // Rotate cube
        cubeRef.current.rotation.x += 0.01;
        cubeRef.current.rotation.y += 0.01;

        // Check for mouse hover
        if (raycasterRef.current && cameraRef.current) {
          raycasterRef.current.setFromCamera(
            mouseRef.current,
            cameraRef.current
          );

          const intersects = raycasterRef.current.intersectObject(
            cubeRef.current
          );
          const isHovered = intersects.length > 0;

          if (cubeRef.current.userData.isHovered !== isHovered) {
            cubeRef.current.userData.isHovered = isHovered;

            // Apply hover effects
            if (isHovered) {
              // Scale up on hover
              cubeRef.current.scale.setScalar(1.2);

              // Change material properties
              if (
                cubeRef.current.material instanceof THREE.MeshNormalMaterial
              ) {
                cubeRef.current.material.opacity = 1;
                cubeRef.current.material.wireframe = true;
              }

              hoveredRef.current = true;
            } else {
              // Reset scale
              cubeRef.current.scale.setScalar(1);

              // Reset material properties
              if (
                cubeRef.current.material instanceof THREE.MeshNormalMaterial
              ) {
                cubeRef.current.material.opacity = 0.8;
                cubeRef.current.material.wireframe = false;
              }

              hoveredRef.current = false;
            }
          }

          // Add pulsing effect when hovered
          if (hoveredRef.current && cubeRef.current) {
            const scale = 1.2 + Math.sin(Date.now() * 0.005) * 0.1;
            cubeRef.current.scale.setScalar(scale);
          }
        }
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      if (statsRef.current) {
        statsRef.current.update();
      }
    };

    animate();

    // Cleanup function
    return () => {
      // Remove event listeners
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeEventListener("click", handleClick);
        containerRef.current.removeEventListener(
          "mouseenter",
          handleMouseEnter
        );
        containerRef.current.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      }
      window.removeEventListener("resize", handleResize);

      cancelAnimationFrame(animationFrameIdRef.current);

      if (containerRef.current && rendererRef.current?.domElement) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      if (containerRef.current && statsRef.current?.dom) {
        containerRef.current.removeChild(statsRef.current.dom);
      }

      // Dispose of Three.js resources
      if (cubeRef.current) {
        cubeRef.current.geometry.dispose();
        (cubeRef.current.material as THREE.Material).dispose();
        // Dispose of wireframe
        cubeRef.current.children.forEach((child) => {
          if (child instanceof THREE.LineSegments) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      // Clear refs
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      cubeRef.current = null;
      controlsRef.current = null;
      statsRef.current = null;
      raycasterRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#0d0e12",
        cursor: "default",
      }}
    />
  );
};

export default AnimationLoop;
