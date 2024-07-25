/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");


class RubiksCube {
    scene;
    camera;
    renderer;
    cube;
    controls;
    isAnimating = false;
    constructor() {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        this.cube = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
        this.init();
    }
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
        this.createCube();
        this.scene.add(this.cube);
        this.controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(this.camera, this.renderer.domElement);
        this.addKeyboardListeners();
        this.animate();
    }
    colors = {
        front: 0xff0000,
        back: 0xffa500,
        up: 0xffffff,
        down: 0xffff00,
        right: 0x00ff00,
        left: 0x0000ff // 青
    };
    createCube() {
        const size = 1;
        const gap = 0.1;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(size, size, size);
                    const materials = [
                        new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: x === 1 ? this.colors.right : 0x000000 }),
                        new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: x === -1 ? this.colors.left : 0x000000 }),
                        new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: y === 1 ? this.colors.up : 0x000000 }),
                        new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: y === -1 ? this.colors.down : 0x000000 }),
                        new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: z === 1 ? this.colors.front : 0x000000 }),
                        new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: z === -1 ? this.colors.back : 0x000000 })
                    ];
                    const cubelet = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, materials);
                    cubelet.position.set(x * (size + gap), y * (size + gap), z * (size + gap));
                    this.cube.add(cubelet);
                }
            }
        }
    }
    addKeyboardListeners() {
        document.addEventListener('keydown', (event) => {
            if (this.isAnimating)
                return;
            switch (event.key) {
                case 'ArrowRight':
                    this.rotateFace('right');
                    break;
                case 'ArrowLeft':
                    this.rotateFace('left');
                    break;
                case 'ArrowUp':
                    this.rotateFace('up');
                    break;
                case 'ArrowDown':
                    this.rotateFace('down');
                    break;
                // 他の回転操作を追加
            }
        });
    }
    rotateFace(face) {
        this.isAnimating = true;
        const rotationAxis = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        const cubelets = [];
        const rotationMatrix = new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4();
        switch (face) {
            case 'right':
                rotationAxis.set(1, 0, 0);
                this.cube.children.forEach(cubelet => {
                    if (Math.abs(cubelet.position.x - 1.1) < 0.1) {
                        cubelets.push(cubelet);
                    }
                });
                break;
            case 'left':
                rotationAxis.set(-1, 0, 0);
                this.cube.children.forEach(cubelet => {
                    if (Math.abs(cubelet.position.x + 1.1) < 0.1) {
                        cubelets.push(cubelet);
                    }
                });
                break;
            case 'up':
                rotationAxis.set(0, 1, 0);
                this.cube.children.forEach(cubelet => {
                    if (Math.abs(cubelet.position.y - 1.1) < 0.1) {
                        cubelets.push(cubelet);
                    }
                });
                break;
            case 'down':
                rotationAxis.set(0, -1, 0);
                this.cube.children.forEach(cubelet => {
                    if (Math.abs(cubelet.position.y + 1.1) < 0.1) {
                        cubelets.push(cubelet);
                    }
                });
                break;
            // 他の面の回転操作を追加
        }
        rotationMatrix.makeRotationAxis(rotationAxis, Math.PI / 2);
        const rotateAnimation = (cubelets, matrix, duration, callback) => {
            let start = performance.now();
            const tempMatrix = new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4();
            const originalPositions = cubelets.map(cubelet => cubelet.position.clone());
            const originalQuaternions = cubelets.map(cubelet => cubelet.quaternion.clone());
            const animateRotation = (time) => {
                let elapsed = time - start;
                if (elapsed > duration)
                    elapsed = duration;
                const fraction = elapsed / duration;
                cubelets.forEach((cubelet, index) => {
                    tempMatrix.copy(matrix).multiply(new three__WEBPACK_IMPORTED_MODULE_1__.Matrix4().makeTranslation(originalPositions[index].x, originalPositions[index].y, originalPositions[index].z));
                    cubelet.position.setFromMatrixPosition(tempMatrix);
                    cubelet.quaternion.slerpQuaternions(originalQuaternions[index], new three__WEBPACK_IMPORTED_MODULE_1__.Quaternion().setFromRotationMatrix(matrix), fraction);
                });
                this.renderer.render(this.scene, this.camera);
                if (elapsed < duration) {
                    requestAnimationFrame(animateRotation);
                }
                else {
                    callback();
                }
            };
            requestAnimationFrame(animateRotation);
        };
        rotateAnimation(cubelets, rotationMatrix, 500, () => {
            cubelets.forEach(cubelet => {
                cubelet.position.clone().applyMatrix4(rotationMatrix);
                cubelet.updateMatrix();
            });
            this.isAnimating = false;
        });
    }
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
const rubiksCube = new RubiksCube();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxDQUFDO0lBQ2hELENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7Ozs7Ozs7VUN4THBDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scyc7XG5cbmNsYXNzIFJ1Ymlrc0N1YmUge1xuICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgcHJpdmF0ZSBjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICBwcml2YXRlIHJlbmRlcmVyOiBUSFJFRS5XZWJHTFJlbmRlcmVyO1xuICBwcml2YXRlIGN1YmU6IFRIUkVFLkdyb3VwO1xuICBwcml2YXRlIGNvbnRyb2xzOiBPcmJpdENvbnRyb2xzO1xuICBwcml2YXRlIGlzQW5pbWF0aW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICB0aGlzLmN1YmUgPSBuZXcgVEhSRUUuR3JvdXAoKTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0KCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gNTtcblxuICAgIHRoaXMuY3JlYXRlQ3ViZSgpO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY3ViZSk7XG5cbiAgICB0aGlzLmNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHModGhpcy5jYW1lcmEsIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgdGhpcy5hZGRLZXlib2FyZExpc3RlbmVycygpO1xuICAgIHRoaXMuYW5pbWF0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb2xvcnMgPSB7XG4gICAgZnJvbnQ6IDB4ZmYwMDAwLCAgLy8g6LWkXG4gICAgYmFjazogMHhmZmE1MDAsICAgLy8g44Kq44Os44Oz44K4XG4gICAgdXA6IDB4ZmZmZmZmLCAgICAgLy8g55m9XG4gICAgZG93bjogMHhmZmZmMDAsICAgLy8g6buEXG4gICAgcmlnaHQ6IDB4MDBmZjAwLCAgLy8g57eRXG4gICAgbGVmdDogMHgwMDAwZmYgICAgLy8g6Z2SXG4gIH07XG5cbiAgcHJpdmF0ZSBjcmVhdGVDdWJlKCk6IHZvaWQge1xuICAgIGNvbnN0IHNpemUgPSAxO1xuICAgIGNvbnN0IGdhcCA9IDAuMTtcblxuICAgIGZvciAobGV0IHggPSAtMTsgeCA8PSAxOyB4KyspIHtcbiAgICAgIGZvciAobGV0IHkgPSAtMTsgeSA8PSAxOyB5KyspIHtcbiAgICAgICAgZm9yIChsZXQgeiA9IC0xOyB6IDw9IDE7IHorKykge1xuICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHNpemUsIHNpemUsIHNpemUpO1xuICAgICAgICAgIGNvbnN0IG1hdGVyaWFscyA9IFtcbiAgICAgICAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiB4ID09PSAxID8gdGhpcy5jb2xvcnMucmlnaHQgOiAweDAwMDAwMCB9KSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiB4ID09PSAtMSA/IHRoaXMuY29sb3JzLmxlZnQgOiAweDAwMDAwMCB9KSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiB5ID09PSAxID8gdGhpcy5jb2xvcnMudXAgOiAweDAwMDAwMCB9KSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiB5ID09PSAtMSA/IHRoaXMuY29sb3JzLmRvd24gOiAweDAwMDAwMCB9KSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiB6ID09PSAxID8gdGhpcy5jb2xvcnMuZnJvbnQgOiAweDAwMDAwMCB9KSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiB6ID09PSAtMSA/IHRoaXMuY29sb3JzLmJhY2sgOiAweDAwMDAwMCB9KVxuICAgICAgICAgIF07XG4gICAgICAgICAgY29uc3QgY3ViZWxldCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHMpO1xuXG4gICAgICAgICAgY3ViZWxldC5wb3NpdGlvbi5zZXQoXG4gICAgICAgICAgICB4ICogKHNpemUgKyBnYXApLFxuICAgICAgICAgICAgeSAqIChzaXplICsgZ2FwKSxcbiAgICAgICAgICAgIHogKiAoc2l6ZSArIGdhcClcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdGhpcy5jdWJlLmFkZChjdWJlbGV0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkS2V5Ym9hcmRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNBbmltYXRpbmcpIHJldHVybjtcblxuICAgICAgc3dpdGNoKGV2ZW50LmtleSkge1xuICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICB0aGlzLnJvdGF0ZUZhY2UoJ3JpZ2h0Jyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgdGhpcy5yb3RhdGVGYWNlKCdsZWZ0Jyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgIHRoaXMucm90YXRlRmFjZSgndXAnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICB0aGlzLnJvdGF0ZUZhY2UoJ2Rvd24nKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8g5LuW44Gu5Zue6Lui5pON5L2c44KS6L+95YqgXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJvdGF0ZUZhY2UoZmFjZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5pc0FuaW1hdGluZyA9IHRydWU7XG4gICAgY29uc3Qgcm90YXRpb25BeGlzID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICBjb25zdCBjdWJlbGV0czogVEhSRUUuT2JqZWN0M0RbXSA9IFtdO1xuICAgIGNvbnN0IHJvdGF0aW9uTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcblxuICAgIHN3aXRjaChmYWNlKSB7XG4gICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgIHJvdGF0aW9uQXhpcy5zZXQoMSwgMCwgMCk7XG4gICAgICAgIHRoaXMuY3ViZS5jaGlsZHJlbi5mb3JFYWNoKGN1YmVsZXQgPT4ge1xuICAgICAgICAgIGlmIChNYXRoLmFicyhjdWJlbGV0LnBvc2l0aW9uLnggLSAxLjEpIDwgMC4xKSB7XG4gICAgICAgICAgICBjdWJlbGV0cy5wdXNoKGN1YmVsZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgIHJvdGF0aW9uQXhpcy5zZXQoLTEsIDAsIDApO1xuICAgICAgICB0aGlzLmN1YmUuY2hpbGRyZW4uZm9yRWFjaChjdWJlbGV0ID0+IHtcbiAgICAgICAgICBpZiAoTWF0aC5hYnMoY3ViZWxldC5wb3NpdGlvbi54ICsgMS4xKSA8IDAuMSkge1xuICAgICAgICAgICAgY3ViZWxldHMucHVzaChjdWJlbGV0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgcm90YXRpb25BeGlzLnNldCgwLCAxLCAwKTtcbiAgICAgICAgdGhpcy5jdWJlLmNoaWxkcmVuLmZvckVhY2goY3ViZWxldCA9PiB7XG4gICAgICAgICAgaWYgKE1hdGguYWJzKGN1YmVsZXQucG9zaXRpb24ueSAtIDEuMSkgPCAwLjEpIHtcbiAgICAgICAgICAgIGN1YmVsZXRzLnB1c2goY3ViZWxldCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgcm90YXRpb25BeGlzLnNldCgwLCAtMSwgMCk7XG4gICAgICAgIHRoaXMuY3ViZS5jaGlsZHJlbi5mb3JFYWNoKGN1YmVsZXQgPT4ge1xuICAgICAgICAgIGlmIChNYXRoLmFicyhjdWJlbGV0LnBvc2l0aW9uLnkgKyAxLjEpIDwgMC4xKSB7XG4gICAgICAgICAgICBjdWJlbGV0cy5wdXNoKGN1YmVsZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8g5LuW44Gu6Z2i44Gu5Zue6Lui5pON5L2c44KS6L+95YqgXG4gICAgfVxuXG4gICAgcm90YXRpb25NYXRyaXgubWFrZVJvdGF0aW9uQXhpcyhyb3RhdGlvbkF4aXMsIE1hdGguUEkgLyAyKTtcblxuICAgIGNvbnN0IHJvdGF0ZUFuaW1hdGlvbiA9IChjdWJlbGV0czogVEhSRUUuT2JqZWN0M0RbXSwgbWF0cml4OiBUSFJFRS5NYXRyaXg0LCBkdXJhdGlvbjogbnVtYmVyLCBjYWxsYmFjazogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgbGV0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBjb25zdCB0ZW1wTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsUG9zaXRpb25zID0gY3ViZWxldHMubWFwKGN1YmVsZXQgPT4gY3ViZWxldC5wb3NpdGlvbi5jbG9uZSgpKTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsUXVhdGVybmlvbnMgPSBjdWJlbGV0cy5tYXAoY3ViZWxldCA9PiBjdWJlbGV0LnF1YXRlcm5pb24uY2xvbmUoKSk7XG5cbiAgICAgIGNvbnN0IGFuaW1hdGVSb3RhdGlvbiA9ICh0aW1lOiBudW1iZXIpID0+IHtcbiAgICAgICAgbGV0IGVsYXBzZWQgPSB0aW1lIC0gc3RhcnQ7XG4gICAgICAgIGlmIChlbGFwc2VkID4gZHVyYXRpb24pIGVsYXBzZWQgPSBkdXJhdGlvbjtcbiAgICAgICAgY29uc3QgZnJhY3Rpb24gPSBlbGFwc2VkIC8gZHVyYXRpb247XG5cbiAgICAgICAgY3ViZWxldHMuZm9yRWFjaCgoY3ViZWxldCwgaW5kZXgpID0+IHtcbiAgICAgICAgICB0ZW1wTWF0cml4LmNvcHkobWF0cml4KS5tdWx0aXBseShuZXcgVEhSRUUuTWF0cml4NCgpLm1ha2VUcmFuc2xhdGlvbihvcmlnaW5hbFBvc2l0aW9uc1tpbmRleF0ueCwgb3JpZ2luYWxQb3NpdGlvbnNbaW5kZXhdLnksIG9yaWdpbmFsUG9zaXRpb25zW2luZGV4XS56KSk7XG4gICAgICAgICAgY3ViZWxldC5wb3NpdGlvbi5zZXRGcm9tTWF0cml4UG9zaXRpb24odGVtcE1hdHJpeCk7XG4gICAgICAgICAgY3ViZWxldC5xdWF0ZXJuaW9uLnNsZXJwUXVhdGVybmlvbnMob3JpZ2luYWxRdWF0ZXJuaW9uc1tpbmRleF0sIG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbVJvdGF0aW9uTWF0cml4KG1hdHJpeCksIGZyYWN0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuXG4gICAgICAgIGlmIChlbGFwc2VkIDwgZHVyYXRpb24pIHtcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZVJvdGF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGVSb3RhdGlvbik7XG4gICAgfTtcblxuICAgIHJvdGF0ZUFuaW1hdGlvbihjdWJlbGV0cywgcm90YXRpb25NYXRyaXgsIDUwMCwgKCkgPT4ge1xuICAgICAgY3ViZWxldHMuZm9yRWFjaChjdWJlbGV0ID0+IHtcbiAgICAgICAgY3ViZWxldC5wb3NpdGlvbi5hcHBseU1hdHJpeDQocm90YXRpb25NYXRyaXgpO1xuICAgICAgICBjdWJlbGV0LnVwZGF0ZU1hdHJpeCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuXG4gIHByaXZhdGUgYW5pbWF0ZSgpOiB2b2lkIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hbmltYXRlKCkpO1xuICAgIHRoaXMuY29udHJvbHMudXBkYXRlKCk7XG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICB9XG59XG5cbmNvbnN0IHJ1Ymlrc0N1YmUgPSBuZXcgUnViaWtzQ3ViZSgpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiaXRDb250cm9sc19qc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==