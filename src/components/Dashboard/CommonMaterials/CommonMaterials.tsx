// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import Stats from "three/addons/libs/stats.module.js";
// import { GUI } from "dat.gui";

// const CommonMaterials = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [renderKey, setRenderKey] = useState(0);
//   const labelsRef = useRef<HTMLDivElement[]>([]);

//   useEffect(() => {
//     let scene: THREE.Scene;
//     let camera: THREE.PerspectiveCamera;
//     let renderer: THREE.WebGLRenderer;
//     let controls: OrbitControls;
//     let light: THREE.DirectionalLight;
//     let stats: Stats;
//     let gui: GUI;
//     let animationFrameId: number;

//     let plane: THREE.Mesh;
//     const meshes: THREE.Mesh[] = [];
//     const labels: HTMLDivElement[] = [];

//     const data = {
//       color: 0x00ff00,
//       labelsVisible: true,
//     };

//     const initScene = () => {
//       if (!containerRef.current) return;

//       // Clear container
//       containerRef.current.innerHTML = "";

//       // Initialize scene
//       scene = new THREE.Scene();
//       scene.background = new THREE.Color(0x0d0e12);

//       // Add grid helper
//       const gridHelper = new THREE.GridHelper(10, 10);
//       scene.add(gridHelper);

//       // Initialize camera
//       camera = new THREE.PerspectiveCamera(
//         75,
//         containerRef.current.clientWidth / containerRef.current.clientHeight,
//         0.1,
//         100
//       );
//       camera.position.set(-1, 4, 2.5);

//       // Initialize renderer
//       renderer = new THREE.WebGLRenderer({
//         antialias: true,
//         alpha: true,
//       });
//       renderer.setSize(
//         containerRef.current.clientWidth,
//         containerRef.current.clientHeight
//       );
//       renderer.setPixelRatio(window.devicePixelRatio);
//       containerRef.current.appendChild(renderer.domElement);

//       // Initialize OrbitControls
//       controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.05;

//       // Add light
//       light = new THREE.DirectionalLight(0xffffff, Math.PI);
//       light.position.set(1, 1, 1);
//       scene.add(light);

//       // Create plane
//       plane = new THREE.Mesh(
//         new THREE.PlaneGeometry(10, 10),
//         new THREE.MeshNormalMaterial({})
//       );
//       plane.rotation.x = -Math.PI / 2;
//       plane.visible = true;
//       scene.add(plane);

//       // Create geometry
//       const geometry = new THREE.IcosahedronGeometry(1, 1);

//       // Create meshes with different materials
//       meshes.push(
//         new THREE.Mesh(
//           geometry,
//           new THREE.MeshBasicMaterial({ color: data.color })
//         ),
//         new THREE.Mesh(
//           geometry,
//           new THREE.MeshNormalMaterial({ flatShading: true })
//         ),
//         new THREE.Mesh(
//           geometry,
//           new THREE.MeshPhongMaterial({ color: data.color, flatShading: true })
//         ),
//         new THREE.Mesh(
//           geometry,
//           new THREE.MeshStandardMaterial({
//             color: data.color,
//             flatShading: true,
//           })
//         )
//       );

//       // Position meshes
//       meshes[0].position.set(-3, 1, 0);
//       meshes[1].position.set(-1, 1, 0);
//       meshes[2].position.set(1, 1, 0);
//       meshes[3].position.set(3, 1, 0);

//       // Add meshes to scene
//       scene.add(...meshes);

//       // Create label containers
//       const labelContainer = document.createElement("div");
//       labelContainer.style.position = "absolute";
//       labelContainer.style.top = "0";
//       labelContainer.style.left = "0";
//       labelContainer.style.width = "100%";
//       labelContainer.style.height = "100%";
//       labelContainer.style.pointerEvents = "none";
//       labelContainer.style.zIndex = "100";

//       const materialNames = [
//         "MeshBasicMaterial",
//         "MeshNormalMaterial",
//         "MeshPhongMaterial",
//         "MeshStandardMaterial",
//       ];

//       materialNames.forEach((name, index) => {
//         const label = document.createElement("div");
//         label.className = "material-label";
//         label.textContent = name;
//         label.style.position = "absolute";
//         label.style.color = "white";
//         label.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
//         label.style.padding = "5px 10px";
//         label.style.borderRadius = "3px";
//         label.style.fontSize = "14px";
//         label.style.fontFamily = "monospace";
//         label.style.textAlign = "center";
//         label.style.minWidth = "180px";
//         label.style.display = data.labelsVisible ? "block" : "none";
//         labelContainer.appendChild(label);
//         labels.push(label);
//       });

//       containerRef.current.appendChild(labelContainer);
//       labelsRef.current = labels;

//       // Initialize Stats.js
//       stats = new Stats();
//       stats.dom.style.position = "absolute";
//       stats.dom.style.top = "0px";
//       stats.dom.style.right = "0px";
//       stats.dom.style.left = "auto";
//       containerRef.current.appendChild(stats.dom);

//       // Initialize GUI on RIGHT SIDE
//       gui = new GUI({ width: 300 });
//       gui.domElement.style.position = "absolute";
//       gui.domElement.style.top = "0px";
//       gui.domElement.style.right = "10px"; // Changed from left to right
//       gui.domElement.style.left = "auto";

//       // MeshBasicMaterial folder
//       const meshBasicMaterialFolder = gui.addFolder("MeshBasicMaterial");
//       meshBasicMaterialFolder.addColor(data, "color").onChange(() => {
//         (meshes[0].material as THREE.MeshBasicMaterial).color.set(data.color);
//       });
//       meshBasicMaterialFolder.add(meshes[0].material, "wireframe");
//       meshBasicMaterialFolder.open();

//       // MeshNormalMaterial folder
//       const meshNormalMaterialFolder = gui.addFolder("MeshNormalMaterial");
//       meshNormalMaterialFolder
//         .add(meshes[1].material as THREE.MeshNormalMaterial, "flatShading")
//         .onChange(() => {
//           meshes[1].material.needsUpdate = true;
//         });
//       meshNormalMaterialFolder.add(meshes[1].material, "wireframe");
//       meshNormalMaterialFolder.open();

//       // MeshPhongMaterial folder
//       const meshPhongMaterialFolder = gui.addFolder("MeshPhongMaterial");
//       meshPhongMaterialFolder.addColor(data, "color").onChange(() => {
//         (meshes[2].material as THREE.MeshPhongMaterial).color.set(data.color);
//       });
//       meshPhongMaterialFolder
//         .add(meshes[2].material as THREE.MeshPhongMaterial, "flatShading")
//         .onChange(() => {
//           meshes[2].material.needsUpdate = true;
//         });
//       meshPhongMaterialFolder.add(meshes[2].material, "wireframe");
//       meshPhongMaterialFolder.open();

//       // MeshStandardMaterial folder
//       const meshStandardMaterialFolder = gui.addFolder("MeshStandardMaterial");
//       meshStandardMaterialFolder.addColor(data, "color").onChange(() => {
//         (meshes[3].material as THREE.MeshStandardMaterial).color.set(
//           data.color
//         );
//       });
//       meshStandardMaterialFolder
//         .add(meshes[3].material as THREE.MeshStandardMaterial, "flatShading")
//         .onChange(() => {
//           meshes[3].material.needsUpdate = true;
//         });
//       meshStandardMaterialFolder.add(meshes[3].material, "wireframe");
//       meshStandardMaterialFolder.open();

//       // Light folder
//       const lightFolder = gui.addFolder("Light");
//       lightFolder.add(light, "visible");
//       lightFolder.add(light.position, "x", -10, 10, 0.1);
//       lightFolder.add(light.position, "y", -10, 10, 0.1);
//       lightFolder.add(light.position, "z", -10, 10, 0.1);
//       lightFolder.open();

//       // Grid folder
//       const gridFolder = gui.addFolder("Grid");
//       gridFolder.add(gridHelper, "visible");
//       gridFolder.open();

//       // Labels folder
//       const labelsFolder = gui.addFolder("Labels");
//       labelsFolder.add(data, "labelsVisible").onChange((value: boolean) => {
//         labels.forEach((label) => {
//           label.style.display = value ? "block" : "none";
//         });
//       });
//       labelsFolder.open();

//       // Plane folder
//       const planeFolder = gui.addFolder("Plane");
//       planeFolder.add(plane, "visible");
//       planeFolder.open();

//       // Camera folder
//       const cameraFolder = gui.addFolder("Camera");
//       cameraFolder.add(camera.position, "x", -10, 10, 0.1);
//       cameraFolder.add(camera.position, "y", -10, 10, 0.1);
//       cameraFolder.add(camera.position, "z", -10, 10, 0.1);
//       cameraFolder.open();

//       // Add a general settings folder
//       const generalFolder = gui.addFolder("General Settings");
//       generalFolder
//         .add({ autoRotate: true }, "autoRotate")
//         .onChange((value: boolean) => {
//           // Store auto rotate state
//           scene.userData.autoRotate = value;
//         });
//       generalFolder
//         .add({ rotationSpeed: 1 }, "rotationSpeed", 0, 3, 0.1)
//         .onChange((value: number) => {
//           scene.userData.rotationSpeed = value;
//         });
//       generalFolder.open();

//       // Reset button in GUI
//       gui
//         .add(
//           {
//             resetScene: () => {
//               camera.position.set(-1, 4, 2.5);
//               controls.reset();

//               // Reset mesh positions
//               meshes[0].position.set(-3, 1, 0);
//               meshes[1].position.set(-1, 1, 0);
//               meshes[2].position.set(1, 1, 0);
//               meshes[3].position.set(3, 1, 0);

//               // Reset mesh rotations
//               meshes.forEach((mesh) => {
//                 mesh.rotation.set(0, 0, 0);
//               });

//               // Reset light
//               light.position.set(1, 1, 1);
//               light.visible = true;

//               // Reset GUI display
//               gui.updateDisplay();
//             },
//           },
//           "resetScene"
//         )
//         .name("Reset Scene");

//       // Handle window resize
//       const handleResize = () => {
//         if (!containerRef.current || !camera || !renderer) return;

//         camera.aspect =
//           containerRef.current.clientWidth / containerRef.current.clientHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(
//           containerRef.current.clientWidth,
//           containerRef.current.clientHeight
//         );
//       };

//       window.addEventListener("resize", handleResize);

//       // Initialize scene user data
//       scene.userData.autoRotate = true;
//       scene.userData.rotationSpeed = 1;

//       // Vector for projection calculations
//       const v = new THREE.Vector3();

//       // Animation loop
//       const animate = () => {
//         animationFrameId = requestAnimationFrame(animate);

//         // Rotate meshes slowly if auto rotate is enabled
//         if (scene.userData.autoRotate) {
//           meshes.forEach((mesh, index) => {
//             mesh.rotation.y +=
//               0.01 * (index + 1) * scene.userData.rotationSpeed;
//             mesh.rotation.x +=
//               0.005 * (index + 1) * scene.userData.rotationSpeed;
//           });
//         }

//         // Update label positions
//         if (data.labelsVisible) {
//           for (let i = 0; i < meshes.length; i++) {
//             v.copy(meshes[i].position);
//             v.project(camera);

//             const x = ((1 + v.x) / 2) * containerRef.current!.clientWidth - 90;
//             const y = ((1 - v.y) / 2) * containerRef.current!.clientHeight;

//             if (labels[i]) {
//               labels[i].style.left = x + "px";
//               labels[i].style.top = y + "px";
//             }
//           }
//         }

//         controls.update();
//         renderer.render(scene, camera);
//         stats.update();
//       };

//       animate();

//       // Store cleanup function
//       return () => {
//         window.removeEventListener("resize", handleResize);
//         cancelAnimationFrame(animationFrameId);
//       };
//     };

//     const cleanup = initScene();

//     // Cleanup function
//     return () => {
//       if (cleanup) cleanup();

//       if (gui) {
//         gui.destroy();
//       }

//       if (controls) {
//         controls.dispose();
//       }

//       if (
//         stats &&
//         containerRef.current &&
//         stats.dom.parentNode === containerRef.current
//       ) {
//         containerRef.current.removeChild(stats.dom);
//       }

//       if (
//         renderer &&
//         containerRef.current &&
//         renderer.domElement.parentNode === containerRef.current
//       ) {
//         containerRef.current.removeChild(renderer.domElement);
//         renderer.dispose();
//       }

//       // Dispose geometries and materials
//       if (plane) {
//         plane.geometry?.dispose();
//         if (plane.material && !Array.isArray(plane.material)) {
//           plane.material.dispose();
//         }
//       }

//       meshes.forEach((mesh) => {
//         if (mesh) {
//           mesh.geometry?.dispose();
//           if (mesh.material) {
//             if (Array.isArray(mesh.material)) {
//               mesh.material.forEach((material) => material.dispose());
//             } else {
//               mesh.material.dispose();
//             }
//           }
//         }
//       });
//     };
//   }, [renderKey]);

//   const handleReset = () => {
//     setRenderKey((prev) => prev + 1);
//   };

//   return (
//     <div style={{ width: "100%", height: "100vh", position: "relative" }}>
//       <div
//         ref={containerRef}
//         style={{
//           width: "100%",
//           height: "100%",
//           position: "relative",
//           overflow: "hidden",
//           background: "#0d0e12",
//           cursor: "grab",
//         }}
//         onMouseDown={() => {
//           if (containerRef.current) {
//             containerRef.current.style.cursor = "grabbing";
//           }
//         }}
//         onMouseUp={() => {
//           if (containerRef.current) {
//             containerRef.current.style.cursor = "grab";
//           }
//         }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           top: "10px",
//           left: "10px", // Changed from 320px to 10px since GUI is now on right
//           background: "rgba(0, 0, 0, 0.7)",
//           color: "white",
//           padding: "10px",
//           borderRadius: "5px",
//           zIndex: 100,
//           maxWidth: "300px",
//         }}
//       >
//         <h3 style={{ margin: "0 0 10px 0" }}>Common Three.js Materials</h3>
//         <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
//           • <strong>MeshBasicMaterial:</strong> Simple, unlit material
//         </p>
//         <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
//           • <strong>MeshNormalMaterial:</strong> Shows surface normals
//         </p>
//         <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
//           • <strong>MeshPhongMaterial:</strong> Phong shading with specular
//           highlights
//         </p>
//         <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
//           • <strong>MeshStandardMaterial:</strong> PBR material for realistic
//           lighting
//         </p>
//         <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#ffcc00" }}>
//           Adjust material properties in GUI on right →
//         </p>
//         <div style={{ marginTop: "10px", fontSize: "10px", color: "#aaa" }}>
//           © Copyrights Three.js Dashboard 2025. All right reserved. Designed by
//           Zamirul Kabir
//         </div>
//       </div>
//       <button
//         onClick={handleReset}
//         style={{
//           position: "absolute",
//           top: "10px",
//           right: "320px", // Position left of the GUI
//           zIndex: 1000,
//           background: "#ff4444",
//           color: "white",
//           border: "none",
//           padding: "8px 16px",
//           borderRadius: "4px",
//           cursor: "pointer",
//           fontWeight: "bold",
//         }}
//       >
//         Reset Scene
//       </button>
//     </div>
//   );
// };

// export default CommonMaterials;

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "dat.gui";

const CommonMaterials = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderKey, setRenderKey] = useState(0);
  const labelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let light: THREE.DirectionalLight;
    let stats: Stats;
    let gui: GUI;
    let animationFrameId: number;

    let plane: THREE.Mesh;
    const meshes: THREE.Mesh[] = [];
    const labels: HTMLDivElement[] = [];

    const data = {
      color: 0x00ff00,
      labelsVisible: true,
    };

    const initScene = () => {
      if (!containerRef.current) return;

      // Clear container
      containerRef.current.innerHTML = "";

      // Initialize scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0d0e12);

      // Add grid helper
      const gridHelper = new THREE.GridHelper(10, 10);
      scene.add(gridHelper);

      // Initialize camera
      camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        100
      );
      camera.position.set(-1, 4, 2.5);

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

      // Add light
      light = new THREE.DirectionalLight(0xffffff, Math.PI);
      light.position.set(1, 1, 1);
      scene.add(light);

      // Create plane
      plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshNormalMaterial({})
      );
      plane.rotation.x = -Math.PI / 2;
      plane.visible = true;
      scene.add(plane);

      // Create geometry
      const geometry = new THREE.IcosahedronGeometry(1, 1);

      // Create meshes with different materials
      meshes.push(
        new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({ color: data.color })
        ),
        new THREE.Mesh(
          geometry,
          new THREE.MeshNormalMaterial({ flatShading: true })
        ),
        new THREE.Mesh(
          geometry,
          new THREE.MeshPhongMaterial({ color: data.color, flatShading: true })
        ),
        new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({
            color: data.color,
            flatShading: true,
          })
        )
      );

      // Position meshes
      meshes[0].position.set(-3, 1, 0);
      meshes[1].position.set(-1, 1, 0);
      meshes[2].position.set(1, 1, 0);
      meshes[3].position.set(3, 1, 0);

      // Add meshes to scene
      scene.add(...meshes);

      // Create label containers
      const labelContainer = document.createElement("div");
      labelContainer.style.position = "absolute";
      labelContainer.style.top = "0";
      labelContainer.style.left = "0";
      labelContainer.style.width = "100%";
      labelContainer.style.height = "100%";
      labelContainer.style.pointerEvents = "none";
      labelContainer.style.zIndex = "100";

      const materialNames = [
        "MeshBasicMaterial",
        "MeshNormalMaterial",
        "MeshPhongMaterial",
        "MeshStandardMaterial",
      ];

      materialNames.forEach((name) => {
        const label = document.createElement("div");
        label.className = "material-label";
        label.textContent = name;
        label.style.position = "absolute";
        label.style.color = "white";
        label.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        label.style.padding = "5px 10px";
        label.style.borderRadius = "3px";
        label.style.fontSize = "14px";
        label.style.fontFamily = "monospace";
        label.style.textAlign = "center";
        label.style.minWidth = "180px";
        label.style.display = data.labelsVisible ? "block" : "none";
        labelContainer.appendChild(label);
        labels.push(label);
      });

      containerRef.current.appendChild(labelContainer);
      labelsRef.current = labels;

      // Initialize Stats.js
      stats = new Stats();
      stats.dom.style.position = "absolute";
      stats.dom.style.top = "0px";
      stats.dom.style.right = "0px";
      stats.dom.style.left = "auto";
      containerRef.current.appendChild(stats.dom);

      // Initialize GUI on RIGHT SIDE
      gui = new GUI({ width: 300 });
      gui.domElement.style.position = "absolute";
      gui.domElement.style.top = "0px";
      gui.domElement.style.right = "10px";
      gui.domElement.style.left = "auto";

      // Type-safe helper function to get material
      const getMaterial = <T extends THREE.Material>(
        mesh: THREE.Mesh,
        _p0: number
      ): T => {
        const material = mesh.material;
        if (Array.isArray(material)) {
          return material[0] as T;
        }
        return material as T;
      };

      // MeshBasicMaterial folder
      const meshBasicMaterialFolder = gui.addFolder("MeshBasicMaterial");
      meshBasicMaterialFolder.addColor(data, "color").onChange(() => {
        const material = getMaterial<THREE.MeshBasicMaterial>(meshes[0], 0);
        material.color.set(data.color);
      });

      // Create a wireframe property for the GUI
      const basicMaterial = getMaterial<THREE.MeshBasicMaterial>(meshes[0], 0);
      meshBasicMaterialFolder.add(
        basicMaterial,
        "wireframe" as keyof THREE.MeshBasicMaterial
      );
      meshBasicMaterialFolder.open();

      // MeshNormalMaterial folder
      const meshNormalMaterialFolder = gui.addFolder("MeshNormalMaterial");
      const normalMaterial = getMaterial<THREE.MeshNormalMaterial>(
        meshes[1],
        1
      );
      meshNormalMaterialFolder
        .add(normalMaterial, "flatShading" as keyof THREE.MeshNormalMaterial)
        .onChange(() => {
          normalMaterial.needsUpdate = true;
        });
      meshNormalMaterialFolder.add(
        normalMaterial,
        "wireframe" as keyof THREE.MeshNormalMaterial
      );
      meshNormalMaterialFolder.open();

      // MeshPhongMaterial folder
      const meshPhongMaterialFolder = gui.addFolder("MeshPhongMaterial");
      meshPhongMaterialFolder.addColor(data, "color").onChange(() => {
        const material = getMaterial<THREE.MeshPhongMaterial>(meshes[2], 2);
        material.color.set(data.color);
      });

      const phongMaterial = getMaterial<THREE.MeshPhongMaterial>(meshes[2], 2);
      meshPhongMaterialFolder
        .add(phongMaterial, "flatShading" as keyof THREE.MeshPhongMaterial)
        .onChange(() => {
          phongMaterial.needsUpdate = true;
        });
      meshPhongMaterialFolder.add(
        phongMaterial,
        "wireframe" as keyof THREE.MeshPhongMaterial
      );
      meshPhongMaterialFolder.open();

      // MeshStandardMaterial folder
      const meshStandardMaterialFolder = gui.addFolder("MeshStandardMaterial");
      meshStandardMaterialFolder.addColor(data, "color").onChange(() => {
        const material = getMaterial<THREE.MeshStandardMaterial>(meshes[3], 3);
        material.color.set(data.color);
      });

      const standardMaterial = getMaterial<THREE.MeshStandardMaterial>(
        meshes[3],
        3
      );
      meshStandardMaterialFolder
        .add(
          standardMaterial,
          "flatShading" as keyof THREE.MeshStandardMaterial
        )
        .onChange(() => {
          standardMaterial.needsUpdate = true;
        });
      meshStandardMaterialFolder.add(
        standardMaterial,
        "wireframe" as keyof THREE.MeshStandardMaterial
      );
      meshStandardMaterialFolder.open();

      // Light folder
      const lightFolder = gui.addFolder("Light");
      lightFolder.add(light, "visible");
      lightFolder.add(light.position, "x", -10, 10, 0.1);
      lightFolder.add(light.position, "y", -10, 10, 0.1);
      lightFolder.add(light.position, "z", -10, 10, 0.1);
      lightFolder.open();

      // Grid folder
      const gridFolder = gui.addFolder("Grid");
      gridFolder.add(gridHelper, "visible");
      gridFolder.open();

      // Labels folder
      const labelsFolder = gui.addFolder("Labels");
      labelsFolder.add(data, "labelsVisible").onChange((value: boolean) => {
        labels.forEach((label) => {
          label.style.display = value ? "block" : "none";
        });
      });
      labelsFolder.open();

      // Plane folder
      const planeFolder = gui.addFolder("Plane");
      planeFolder.add(plane, "visible");
      planeFolder.open();

      // Camera folder
      const cameraFolder = gui.addFolder("Camera");
      cameraFolder.add(camera.position, "x", -10, 10, 0.1);
      cameraFolder.add(camera.position, "y", -10, 10, 0.1);
      cameraFolder.add(camera.position, "z", -10, 10, 0.1);
      cameraFolder.open();

      // Add a general settings folder
      const generalFolder = gui.addFolder("General Settings");
      generalFolder
        .add({ autoRotate: true }, "autoRotate")
        .onChange((value: boolean) => {
          // Store auto rotate state
          scene.userData.autoRotate = value;
        });
      generalFolder
        .add({ rotationSpeed: 1 }, "rotationSpeed", 0, 3, 0.1)
        .onChange((value: number) => {
          scene.userData.rotationSpeed = value;
        });
      generalFolder.open();

      // Reset button in GUI
      gui
        .add(
          {
            resetScene: () => {
              camera.position.set(-1, 4, 2.5);
              controls.reset();

              // Reset mesh positions
              meshes[0].position.set(-3, 1, 0);
              meshes[1].position.set(-1, 1, 0);
              meshes[2].position.set(1, 1, 0);
              meshes[3].position.set(3, 1, 0);

              // Reset mesh rotations
              meshes.forEach((mesh) => {
                mesh.rotation.set(0, 0, 0);
              });

              // Reset light
              light.position.set(1, 1, 1);
              light.visible = true;

              // Reset materials to default
              const basicMat = getMaterial<THREE.MeshBasicMaterial>(
                meshes[0],
                0
              );
              const normalMat = getMaterial<THREE.MeshNormalMaterial>(
                meshes[1],
                1
              );
              const phongMat = getMaterial<THREE.MeshPhongMaterial>(
                meshes[2],
                2
              );
              const standardMat = getMaterial<THREE.MeshStandardMaterial>(
                meshes[3],
                3
              );

              basicMat.color.set(0x00ff00);
              basicMat.wireframe = false;

              normalMat.flatShading = true;
              normalMat.wireframe = false;
              normalMat.needsUpdate = true;

              phongMat.color.set(0x00ff00);
              phongMat.flatShading = true;
              phongMat.wireframe = false;
              phongMat.needsUpdate = true;

              standardMat.color.set(0x00ff00);
              standardMat.flatShading = true;
              standardMat.wireframe = false;
              standardMat.needsUpdate = true;

              // Reset GUI display
              gui.updateDisplay();
            },
          },
          "resetScene"
        )
        .name("Reset Scene");

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

      // Initialize scene user data
      scene.userData.autoRotate = true;
      scene.userData.rotationSpeed = 1;

      // Vector for projection calculations
      const v = new THREE.Vector3();

      // Animation loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Rotate meshes slowly if auto rotate is enabled
        if (scene.userData.autoRotate) {
          meshes.forEach((mesh, index) => {
            mesh.rotation.y +=
              0.01 * (index + 1) * scene.userData.rotationSpeed;
            mesh.rotation.x +=
              0.005 * (index + 1) * scene.userData.rotationSpeed;
          });
        }

        // Update label positions
        if (data.labelsVisible) {
          for (let i = 0; i < meshes.length; i++) {
            v.copy(meshes[i].position);
            v.project(camera);

            const x = ((1 + v.x) / 2) * containerRef.current!.clientWidth - 90;
            const y = ((1 - v.y) / 2) * containerRef.current!.clientHeight;

            if (labels[i]) {
              labels[i].style.left = x + "px";
              labels[i].style.top = y + "px";
            }
          }
        }

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
      if (plane) {
        plane.geometry?.dispose();
        if (plane.material && !Array.isArray(plane.material)) {
          plane.material.dispose();
        }
      }

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
          left: "10px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          zIndex: 100,
          maxWidth: "300px",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>Common Three.js Materials</h3>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>MeshBasicMaterial:</strong> Simple, unlit material
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>MeshNormalMaterial:</strong> Shows surface normals
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>MeshPhongMaterial:</strong> Phong shading with specular
          highlights
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>MeshStandardMaterial:</strong> PBR material for realistic
          lighting
        </p>
        <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#ffcc00" }}>
          Adjust material properties in GUI on right →
        </p>
        <div style={{ marginTop: "10px", fontSize: "10px", color: "#aaa" }}>
          © Copyrights Three.js Dashboard 2025. All right reserved. Designed by
          Zamirul Kabir
        </div>
      </div>
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

export default CommonMaterials;
