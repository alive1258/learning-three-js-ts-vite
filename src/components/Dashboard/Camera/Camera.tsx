import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "dat.gui";

const CameraScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let cube: THREE.Mesh;
    let stats: Stats;
    let gui: GUI;
    let animationFrameId: number;

    // Camera parameters
    const cameraParams = {
      left: -4,
      right: 4,
      top: 4,
      bottom: -4,
      near: -5,
      far: 10,
      positionX: 1,
      positionY: 1,
      positionZ: 1,
    };

    const initScene = () => {
      if (!containerRef.current) return;

      // Clear container
      containerRef.current.innerHTML = "";

      // Initialize scene with visible background
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0d0e12); // Dark blue-grey background

      // Add grid helper with better visibility
      const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
      scene.add(gridHelper);

      // Initialize camera
      camera = new THREE.OrthographicCamera(
        cameraParams.left,
        cameraParams.right,
        cameraParams.top,
        cameraParams.bottom,
        cameraParams.near,
        cameraParams.far
      );
      camera.position.set(
        cameraParams.positionX,
        cameraParams.positionY,
        cameraParams.positionZ
      );
      camera.lookAt(0, 0.5, 0);

      // Initialize renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      containerRef.current.appendChild(renderer.domElement);

      // Initialize OrbitControls - THIS IS WHAT YOU NEED!
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; // Add smooth damping
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.enableZoom = true;
      controls.enableRotate = true;
      controls.enablePan = true;
      controls.target.set(0, 0.5, 0); // Look at cube initially

      // Create cube with more visible wireframe
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshNormalMaterial({
        wireframe: true,
      });
      cube = new THREE.Mesh(geometry, material);
      cube.position.y = 0.5;
      scene.add(cube);

      // Add coordinate axes for reference
      const axesHelper = new THREE.AxesHelper(3);
      scene.add(axesHelper);

      // Add some ambient light to see objects better
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);

      // Add a directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Initialize Stats.js - position it differently
      stats = new Stats();
      stats.dom.style.position = "absolute";
      stats.dom.style.top = "0px";
      stats.dom.style.right = "0px";
      stats.dom.style.left = "auto";
      containerRef.current.appendChild(stats.dom);

      // Initialize GUI - position it better
      gui = new GUI({ width: 300 });
      gui.domElement.style.position = "absolute";
      gui.domElement.style.top = "0px";
      gui.domElement.style.right = "10px";

      // Debug info display
      const debugInfo = document.createElement("div");
      debugInfo.style.position = "absolute";
      debugInfo.style.top = "10px";
      debugInfo.style.left = "10px";
      debugInfo.style.color = "white";
      debugInfo.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      debugInfo.style.padding = "10px";
      debugInfo.style.borderRadius = "5px";
      debugInfo.style.fontFamily = "monospace";
      debugInfo.style.fontSize = "12px";
      debugInfo.innerHTML = `
        <strong>Camera Controls:</strong><br/>
        • Left-click + drag: Rotate camera<br/>
        • Right-click + drag: Pan camera<br/>
        • Scroll: Zoom in/out<br/>
        • Double-click: Reset view
      `;
      containerRef.current.appendChild(debugInfo);

      // Camera position controls
      const positionFolder = gui.addFolder("Camera Position");
      positionFolder
        .add(cameraParams, "positionX", -10, 10, 0.1)
        .onChange((value: number) => {
          camera.position.x = value;
          controls.target.set(0, 0.5, 0);
          controls.update();
        });
      positionFolder
        .add(cameraParams, "positionY", -10, 10, 0.1)
        .onChange((value: number) => {
          camera.position.y = value;
          controls.target.set(0, 0.5, 0);
          controls.update();
        });
      positionFolder
        .add(cameraParams, "positionZ", -10, 10, 0.1)
        .onChange((value: number) => {
          camera.position.z = value;
          controls.target.set(0, 0.5, 0);
          controls.update();
        });
      positionFolder.open();

      // Camera projection controls
      const projectionFolder = gui.addFolder("Camera Projection");
      projectionFolder
        .add(cameraParams, "left", -10, 0, 0.1)
        .onChange((value: number) => {
          camera.left = value;
          camera.updateProjectionMatrix();
        });
      projectionFolder
        .add(cameraParams, "right", 0, 10, 0.1)
        .onChange((value: number) => {
          camera.right = value;
          camera.updateProjectionMatrix();
        });
      projectionFolder
        .add(cameraParams, "top", 0, 10, 0.1)
        .onChange((value: number) => {
          camera.top = value;
          camera.updateProjectionMatrix();
        });
      projectionFolder
        .add(cameraParams, "bottom", -10, 0, 0.1)
        .onChange((value: number) => {
          camera.bottom = value;
          camera.updateProjectionMatrix();
        });
      projectionFolder
        .add(cameraParams, "near", -10, 5, 0.1)
        .onChange((value: number) => {
          camera.near = value;
          camera.updateProjectionMatrix();
        });
      projectionFolder
        .add(cameraParams, "far", 1, 50, 0.1)
        .onChange((value: number) => {
          camera.far = value;
          camera.updateProjectionMatrix();
        });
      projectionFolder.open();

      // Cube controls
      const cubeFolder = gui.addFolder("Cube");
      cubeFolder.add(cube.position, "x", -5, 5, 0.1);
      cubeFolder.add(cube.position, "y", -5, 5, 0.1);
      cubeFolder.add(cube.position, "z", -5, 5, 0.1);
      cubeFolder.add(cube.scale, "x", 0.1, 3, 0.1);
      cubeFolder.add(cube.scale, "y", 0.1, 3, 0.1);
      cubeFolder.add(cube.scale, "z", 0.1, 3, 0.1);
      cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01);
      cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01);
      cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01);

      // Add wireframe toggle
      cubeFolder.add(material, "wireframe").name("Wireframe");
      cubeFolder.open();

      // Controls settings folder
      const controlsFolder = gui.addFolder("Controls Settings");
      controlsFolder.add(controls, "enabled").name("Enable Controls");
      controlsFolder.add(controls, "enableZoom").name("Enable Zoom");
      controlsFolder.add(controls, "enableRotate").name("Enable Rotate");
      controlsFolder.add(controls, "enablePan").name("Enable Pan");
      controlsFolder
        .add(controls, "screenSpacePanning")
        .name("Screen Space Pan");
      controlsFolder.add(controls, "autoRotate").name("Auto Rotate");
      controlsFolder.open();

      // Reset button
      gui
        .add(
          {
            resetCamera: () => {
              cameraParams.left = -4;
              cameraParams.right = 4;
              cameraParams.top = 4;
              cameraParams.bottom = -4;
              cameraParams.near = -5;
              cameraParams.far = 10;
              cameraParams.positionX = 1;
              cameraParams.positionY = 1;
              cameraParams.positionZ = 1;

              camera.left = cameraParams.left;
              camera.right = cameraParams.right;
              camera.top = cameraParams.top;
              camera.bottom = cameraParams.bottom;
              camera.near = cameraParams.near;
              camera.far = cameraParams.far;
              camera.position.set(
                cameraParams.positionX,
                cameraParams.positionY,
                cameraParams.positionZ
              );
              camera.updateProjectionMatrix();

              // Reset controls
              controls.reset();
              controls.target.set(0, 0.5, 0);
              controls.update();

              // Update GUI
              gui.updateDisplay();
            },
          },
          "resetCamera"
        )
        .name("Reset Camera");

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !camera || !renderer) return;

        renderer.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      };

      window.addEventListener("resize", handleResize);

      // Animation loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Update controls
        controls.update();

        renderer.render(scene, camera);
        stats.update();
      };

      animate();

      // Store cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);

        // Remove debug info
        if (debugInfo.parentNode === containerRef.current) {
          //   containerRef.current.removeChild(debugInfo);
        }
      };
    };

    const cleanup = initScene();

    // Cleanup function
    return () => {
      if (cleanup) cleanup();

      if (gui) {
        gui.destroy();
      }

      if (controls) {
        controls.dispose();
      }

      if (
        stats &&
        containerRef.current &&
        stats.dom.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(stats.dom);
      }

      if (
        renderer &&
        containerRef.current &&
        renderer.domElement.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }

      if (cube && cube.geometry) {
        cube.geometry.dispose();
      }
      if (cube && cube.material) {
        if (Array.isArray(cube.material)) {
          cube.material.forEach((material) => material.dispose());
        } else {
          cube.material.dispose();
        }
      }
    };
  }, [renderKey]);

  const handleReset = () => {
    setRenderKey((prev) => prev + 1);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: "#0d0e12",
          cursor: "grab", // Show grab cursor to indicate it's interactive
        }}
        onMouseDown={() => {
          if (containerRef.current) {
            containerRef.current.style.cursor = "grabbing";
          }
        }}
        onMouseUp={() => {
          if (containerRef.current) {
            containerRef.current.style.cursor = "grab";
          }
        }}
      />

      <button
        onClick={handleReset}
        style={{
          position: "absolute",
          top: "10px",
          right: "320px",
          zIndex: 1000,
          background: "#ff4444",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Reset Scene
      </button>
    </div>
  );
};

export default CameraScene;
