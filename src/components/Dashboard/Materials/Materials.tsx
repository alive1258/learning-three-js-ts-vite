import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "dat.gui";

const Materials = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let stats: Stats;
    let gui: GUI;
    let animationFrameId: number;

    let cube: THREE.Mesh;
    let sphere: THREE.Mesh;
    let icosahedron: THREE.Mesh;
    let plane: THREE.Mesh;
    let torusKnot: THREE.Mesh;

    const initScene = () => {
      if (!containerRef.current) return;

      // Clear container
      containerRef.current.innerHTML = "";

      // Initialize scene with environment map
      scene = new THREE.Scene();

      // Load environment map
      const envMapLoader = new THREE.CubeTextureLoader().setPath(
        "https://sbcode.net/img/"
      );

      const envMap = envMapLoader.load([
        "px.png",
        "nx.png",
        "py.png",
        "ny.png",
        "pz.png",
        "nz.png",
      ]);

      scene.environment = envMap;
      scene.background = new THREE.Color(0x0d0e12);

      // Add helpers
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);

      const gridHelper = new THREE.GridHelper(10, 10);
      gridHelper.position.y = -1;
      scene.add(gridHelper);

      // Initialize camera
      camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 2, 7);

      // Initialize renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.setPixelRatio(window.devicePixelRatio);
      containerRef.current.appendChild(renderer.domElement);

      // Initialize OrbitControls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      // Create geometries
      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const icosahedronGeometry = new THREE.IcosahedronGeometry(0.5, 0);
      const planeGeometry = new THREE.PlaneGeometry(1, 1);
      const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);

      // Create material
      const material = new THREE.MeshNormalMaterial();

      // Create meshes
      cube = new THREE.Mesh(boxGeometry, material);
      cube.position.set(5, 0, 0);
      scene.add(cube);

      sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.set(3, 0, 0);
      scene.add(sphere);

      icosahedron = new THREE.Mesh(icosahedronGeometry, material);
      icosahedron.position.set(0, 0, 0);
      scene.add(icosahedron);

      plane = new THREE.Mesh(planeGeometry, material);
      plane.position.set(-2, 0, 0);
      scene.add(plane);

      torusKnot = new THREE.Mesh(torusKnotGeometry, material);
      torusKnot.position.set(-5, 0, 0);
      scene.add(torusKnot);

      // Add some rotation to meshes for visual interest
      const meshes = [cube, sphere, icosahedron, plane, torusKnot];
      meshes.forEach((mesh, index) => {
        mesh.userData.rotationSpeed = {
          x: 0.01 * (index + 1),
          y: 0.005 * (index + 1),
          z: 0.0025 * (index + 1),
        };
      });

      // Initialize Stats.js
      stats = new Stats();
      stats.dom.style.position = "absolute";
      stats.dom.style.top = "0px";
      stats.dom.style.right = "0px";
      stats.dom.style.left = "auto";
      containerRef.current.appendChild(stats.dom);

      // Initialize GUI - POSITIONED ON RIGHT SIDE
      gui = new GUI({ width: 300 });
      gui.domElement.style.position = "absolute";
      gui.domElement.style.top = "0px";
      gui.domElement.style.right = "10px"; // Changed to right side
      gui.domElement.style.left = "auto"; // Ensure left is auto

      // Material options
      const options = {
        side: {
          FrontSide: THREE.FrontSide,
          BackSide: THREE.BackSide,
          DoubleSide: THREE.DoubleSide,
        },
      };

      // Material folder
      const materialFolder = gui.addFolder("THREE.Material");
      materialFolder.add(material, "transparent").onChange(() => {
        material.needsUpdate = true;
        updateAllMeshes(material);
      });
      materialFolder
        .add(material, "opacity", 0, 1, 0.01)
        .onChange(() => updateAllMeshes(material));
      materialFolder.add(material, "alphaTest", 0, 1, 0.01).onChange(() => {
        material.needsUpdate = true;
        updateAllMeshes(material);
      });
      materialFolder
        .add(material, "visible")
        .onChange(() => updateAllMeshes(material));
      materialFolder
        .add(material, "side", options.side)
        .onChange((value: THREE.Side) => {
          material.side = value;
          material.needsUpdate = true;
          updateAllMeshes(material);
        });

      // Wireframe folder
      const wireframeFolder = materialFolder.addFolder("Wireframe");
      wireframeFolder
        .add(material, "wireframe")
        .onChange(() => updateAllMeshes(material));
      wireframeFolder
        .add(material, "wireframeLinewidth", 1, 10, 1)
        .onChange(() => updateAllMeshes(material));
      wireframeFolder.open();

      materialFolder.open();

      // Camera folder
      const cameraFolder = gui.addFolder("Camera");
      cameraFolder.add(camera.position, "x", -10, 10, 0.1);
      cameraFolder.add(camera.position, "y", -10, 10, 0.1);
      cameraFolder.add(camera.position, "z", -10, 10, 0.1);
      cameraFolder
        .add(camera, "fov", 20, 100, 1)
        .onChange(() => camera.updateProjectionMatrix());
      cameraFolder.open();

      // Mesh controls folder
      const meshControlsFolder = gui.addFolder("Mesh Controls");
      const rotationFolder = meshControlsFolder.addFolder("Rotation Speed");
      rotationFolder
        .add({ speed: 1 }, "speed", 0, 5, 0.1)
        .onChange((value: number) => {
          meshes.forEach((mesh, index) => {
            mesh.userData.rotationSpeed = {
              x: 0.01 * (index + 1) * value,
              y: 0.005 * (index + 1) * value,
              z: 0.0025 * (index + 1) * value,
            };
          });
        });
      rotationFolder.open();

      const positionFolder = meshControlsFolder.addFolder("Reset Positions");
      positionFolder
        .add(
          {
            resetPositions: () => {
              cube.position.set(5, 0, 0);
              sphere.position.set(3, 0, 0);
              icosahedron.position.set(0, 0, 0);
              plane.position.set(-2, 0, 0);
              torusKnot.position.set(-5, 0, 0);
            },
          },
          "resetPositions"
        )
        .name("Reset All");
      positionFolder.open();

      meshControlsFolder.open();

      // Add a reset button in the GUI
      gui
        .add(
          {
            resetScene: () => {
              // Reset camera
              camera.position.set(0, 2, 7);
              controls.reset();

              // Reset mesh positions
              cube.position.set(5, 0, 0);
              sphere.position.set(3, 0, 0);
              icosahedron.position.set(0, 0, 0);
              plane.position.set(-2, 0, 0);
              torusKnot.position.set(-5, 0, 0);

              // Reset mesh rotations
              meshes.forEach((mesh) => {
                mesh.rotation.set(0, 0, 0);
              });

              // Reset material to default
              material.transparent = false;
              material.opacity = 1;
              material.alphaTest = 0;
              material.visible = true;
              material.side = THREE.FrontSide;
              material.wireframe = false;
              material.wireframeLinewidth = 1;
              material.needsUpdate = true;
              updateAllMeshes(material);

              // Update GUI display
              gui.updateDisplay();
            },
          },
          "resetScene"
        )
        .name("Reset Scene");

      // Helper function to update all meshes with new material
      const updateAllMeshes = (newMaterial: THREE.Material) => {
        [cube, sphere, icosahedron, plane, torusKnot].forEach((mesh) => {
          mesh.material = newMaterial;
        });
      };

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !camera || !renderer) return;

        camera.aspect =
          containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      };

      window.addEventListener("resize", handleResize);

      // Animation loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Rotate meshes
        [cube, sphere, icosahedron, plane, torusKnot].forEach((mesh) => {
          if (mesh.userData.rotationSpeed) {
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
          }
        });

        controls.update();
        renderer.render(scene, camera);
        stats.update();
      };

      animate();

      // Store cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
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

      // Dispose geometries and materials
      const meshes = [cube, sphere, icosahedron, plane, torusKnot];
      meshes.forEach((mesh) => {
        if (mesh) {
          mesh.geometry?.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((material) => material.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });
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
          cursor: "grab",
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
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px", // Changed from 320px to 10px since GUI is now on right
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          zIndex: 100,
          maxWidth: "300px",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>Materials Demo</h3>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>MeshNormalMaterial</strong> applied to all objects
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • Adjust material properties in GUI on right
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • Environment map reflection
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • Objects rotate automatically
        </p>
        <div
          style={{
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            fontSize: "10px",
            color: "#aaa",
          }}
        >
          © Copyrights Three.js Dashboard 2025. All right reserved. Designed by
          Zamirul Kabir
        </div>
      </div>
      <button
        onClick={handleReset}
        style={{
          position: "absolute",
          top: "10px",
          right: "320px", // Position left of the GUI (which is 300px wide + 10px margin)
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

export default Materials;
