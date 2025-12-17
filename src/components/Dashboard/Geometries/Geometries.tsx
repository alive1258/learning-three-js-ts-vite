import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "dat.gui";

const Geometries = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);
  const [renderKey] = useState(0);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let cube: THREE.Mesh;
    let sphere: THREE.Mesh;
    let icosahedron: THREE.Mesh;
    let controls: OrbitControls;
    let stats: Stats;
    let gui: GUI;
    let animationFrameId: number;

    // Data objects for GUI controls
    const cubeData = {
      width: 1,
      height: 1,
      depth: 1,
      widthSegments: 1,
      heightSegments: 1,
      depthSegments: 1,
    };

    const sphereData = {
      radius: 1,
      widthSegments: 8,
      heightSegments: 6,
      phiStart: 0,
      phiLength: Math.PI * 2,
      thetaStart: 0,
      thetaLength: Math.PI,
    };

    const icosahedronData = {
      radius: 1,
      detail: 0,
    };

    if (!containerRef.current) return;

    // Clear container
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Initialize scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0e12);
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.name = "axesHelper";
    scene.add(axesHelper);

    // Initialize camera
    camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(-2, 4, 5);
    // Removed: cameraRef.current = camera; (was causing the error)

    // Initialize renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Initialize OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);

    // Create geometries
    const boxGeometry = new THREE.BoxGeometry();
    const sphereGeometry = new THREE.SphereGeometry();
    const icosahedronGeometry = new THREE.IcosahedronGeometry();

    console.log(boxGeometry);

    const material = new THREE.MeshNormalMaterial({
      wireframe: true,
    });

    // Create meshes
    cube = new THREE.Mesh(boxGeometry, material);
    cube.position.x = -4;
    scene.add(cube);

    sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.position.x = 0;
    scene.add(sphere);

    icosahedron = new THREE.Mesh(icosahedronGeometry, material);
    scene.add(icosahedron);
    icosahedron.position.x = 4;

    // Initialize Stats.js
    stats = new Stats();
    stats.dom.style.position = "absolute";
    stats.dom.style.top = "0px";
    stats.dom.style.right = "0px";
    stats.dom.style.left = "auto";
    containerRef.current.appendChild(stats.dom);

    // Initialize GUI
    gui = new GUI();

    // Cube folder and controls
    const cubeFolder = gui.addFolder("Cube");
    const cubeRotationFolder = cubeFolder.addFolder("Rotation");
    cubeRotationFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01);
    cubeRotationFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01);
    cubeRotationFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01);

    const cubePositionFolder = cubeFolder.addFolder("Position");
    cubePositionFolder.add(cube.position, "x", -10, 10);
    cubePositionFolder.add(cube.position, "y", -10, 10);
    cubePositionFolder.add(cube.position, "z", -10, 10);

    const cubeScaleFolder = cubeFolder.addFolder("Scale");
    cubeScaleFolder.add(cube.scale, "x", -5, 5, 0.1);
    cubeScaleFolder.add(cube.scale, "y", -5, 5, 0.1);
    cubeScaleFolder.add(cube.scale, "z", -5, 5, 0.1);

    cubeFolder
      .add(cubeData, "width", 1, 30)
      .onChange(() => regenerateBoxGeometry())
      .onFinishChange(function () {
        console.log(cube.geometry);
      });
    cubeFolder
      .add(cubeData, "height", 1, 30)
      .onChange(() => regenerateBoxGeometry());
    cubeFolder
      .add(cubeData, "depth", 1, 30)
      .onChange(() => regenerateBoxGeometry());
    cubeFolder
      .add(cubeData, "widthSegments", 1, 30)
      .onChange(() => regenerateBoxGeometry());
    cubeFolder
      .add(cubeData, "heightSegments", 1, 30)
      .onChange(() => regenerateBoxGeometry());
    cubeFolder
      .add(cubeData, "depthSegments", 1, 30)
      .onChange(() => regenerateBoxGeometry());
    cubeFolder.open();

    // Box geometry regeneration function
    function regenerateBoxGeometry() {
      const newGeometry = new THREE.BoxGeometry(
        cubeData.width,
        cubeData.height,
        cubeData.depth,
        cubeData.widthSegments,
        cubeData.heightSegments,
        cubeData.depthSegments
      );
      cube.geometry.dispose();
      cube.geometry = newGeometry;
    }

    // Sphere folder and controls
    const sphereFolder = gui.addFolder("Sphere");
    sphereFolder
      .add(sphereData, "radius", 0.1, 30)
      .onChange(() => regenerateSphereGeometry());
    sphereFolder
      .add(sphereData, "widthSegments", 1, 32)
      .onChange(() => regenerateSphereGeometry());
    sphereFolder
      .add(sphereData, "heightSegments", 1, 16)
      .onChange(() => regenerateSphereGeometry());
    sphereFolder
      .add(sphereData, "phiStart", 0, Math.PI * 2)
      .onChange(() => regenerateSphereGeometry());
    sphereFolder
      .add(sphereData, "phiLength", 0, Math.PI * 2)
      .onChange(() => regenerateSphereGeometry());
    sphereFolder
      .add(sphereData, "thetaStart", 0, Math.PI)
      .onChange(() => regenerateSphereGeometry());
    sphereFolder
      .add(sphereData, "thetaLength", 0, Math.PI)
      .onChange(() => regenerateSphereGeometry());
    sphereFolder.open();

    // Sphere geometry regeneration function
    function regenerateSphereGeometry() {
      const newGeometry = new THREE.SphereGeometry(
        sphereData.radius,
        sphereData.widthSegments,
        sphereData.heightSegments,
        sphereData.phiStart,
        sphereData.phiLength,
        sphereData.thetaStart,
        sphereData.thetaLength
      );
      sphere.geometry.dispose();
      sphere.geometry = newGeometry;
    }

    // Icosahedron folder and controls
    const icosahedronFolder = gui.addFolder("Icosahedron");
    icosahedronFolder
      .add(icosahedronData, "radius", 0.1, 10)
      .onChange(() => regenerateIcosahedronGeometry());
    icosahedronFolder
      .add(icosahedronData, "detail", 0, 5)
      .step(1)
      .onChange(() => regenerateIcosahedronGeometry());
    icosahedronFolder.open();

    // Icosahedron geometry regeneration function
    function regenerateIcosahedronGeometry() {
      const newGeometry = new THREE.IcosahedronGeometry(
        icosahedronData.radius,
        icosahedronData.detail
      );
      icosahedron.geometry.dispose();
      icosahedron.geometry = newGeometry;
    }

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

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

      // Update debug info
      if (debugRef.current) {
        debugRef.current.innerHTML = `
          <strong>Cube Matrix:</strong><br/>
          ${cube.matrix.elements
            .map((n, i) => `${i % 4 === 0 ? "<br/>" : ""}${n.toFixed(3)}`)
            .join(" ")}
        `;
      }

      renderer.render(scene, camera);
      stats.update();
    };

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      // Remove GUI
      if (gui) {
        gui.destroy();
      }

      // Remove renderer and stats from DOM
      if (containerRef.current) {
        if (renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        if (stats.dom.parentNode === containerRef.current) {
          containerRef.current.removeChild(stats.dom);
        }
      }

      // Dispose of Three.js resources
      [cube, sphere, icosahedron].forEach((mesh) => {
        if (mesh && mesh.geometry) {
          mesh.geometry.dispose();
        }
        if (mesh && mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });

      if (renderer) {
        renderer.dispose();
      }

      if (controls) {
        controls.dispose();
      }
    };
  }, [renderKey]);

  // Force remount if scene doesn't work
  //   const handleReset = () => {
  //     setRenderKey((prev) => prev + 1);
  //   };

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
          cursor: "default",
        }}
      >
        <div
          ref={debugRef}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "10px",
            fontSize: "12px",
            fontFamily: "monospace",
            borderRadius: "5px",
            zIndex: 100,
            maxWidth: "300px",
            maxHeight: "200px",
            overflow: "auto",
          }}
        />
      </div>
      {/* <button
        onClick={handleReset}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          background: "#ff4444",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Reset Scene
      </button> */}
    </div>
  );
};

export default Geometries;
