import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { resolvePath } from '../utils'
import { gl } from './core/WebGL'
import { controls } from './utils/OrbitControls'
import { effects } from './effects/Effects'

export class TCanvas {
  private lights = new THREE.Group()

  constructor(private container: HTMLElement) {
    this.loadModel('models/horse.glb').then((result) => {
      this.init()
      this.createLights()
      this.createObjects(result)
      gl.requestAnimationFrame(this.anime)
    })
  }

  private async loadModel(path: string) {
    const loader = new GLTFLoader()
    const drcLoader = new DRACOLoader()
    drcLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    loader.setDRACOLoader(drcLoader)
    const res = await loader.loadAsync(resolvePath(path))
    drcLoader.dispose()
    return res
  }

  private init() {
    gl.setup(this.container)
    gl.scene.background = new THREE.Color('#000')
    gl.camera.position.z = 4

    controls.primitive.enablePan = false
    controls.primitive.enableZoom = false

    gl.setResizeCallback(() => {
      effects.resize()
    })
  }

  private createLights() {
    gl.scene.add(this.lights)

    const dir1 = new THREE.DirectionalLight('#fff')
    dir1.position.set(0, 3, -5)
    dir1.castShadow = true
    dir1.shadow.mapSize.set(2048, 2048)
    const edge = 2
    dir1.shadow.camera = new THREE.OrthographicCamera(-edge, edge, edge, -edge, 0.01, 10)
    this.lights.add(dir1)

    // const helper = new THREE.CameraHelper(dir1.shadow.camera)
    // gl.scene.add(helper)

    const dir2 = new THREE.DirectionalLight('#fff', 0.04)
    dir2.position.set(2, -1, 5)
    this.lights.add(dir2)

    const dir3 = new THREE.DirectionalLight('#fff', 0.04)
    dir3.position.set(-2, -1, 5)
    this.lights.add(dir3)
  }

  private createObjects(gltf: GLTF) {
    const mesh = gltf.scene.children[0] as THREE.Mesh
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.layers.set(gl.DEFAULT_LAYER)
    gl.scene.add(mesh)

    const occlusionMesh = mesh.clone()
    occlusionMesh.material = new THREE.MeshBasicMaterial({ color: '#000' })
    occlusionMesh.layers.set(gl.OCCLUSION_LAYER)
    gl.scene.add(occlusionMesh)

    // const sunGeo = new THREE.SphereGeometry(1.5, 64, 32)
    const sunGeo = new THREE.BoxGeometry(2.5, 2.5, 1)
    sunGeo.translate(0, 0.5, -3)
    const sunMat = new THREE.MeshBasicMaterial()
    const sun = new THREE.Mesh(sunGeo, sunMat)
    sun.name = 'sun_occ'
    sun.layers.set(gl.OCCLUSION_LAYER)
    gl.scene.add(sun)

    const defaultSunMesh = sun.clone()
    defaultSunMesh.material = new THREE.MeshBasicMaterial({ color: '#000' })
    defaultSunMesh.name = 'sun_def'
    defaultSunMesh.layers.set(gl.DEFAULT_LAYER)
    gl.scene.add(defaultSunMesh)
  }

  // ----------------------------------
  // animation
  private anime = () => {
    controls.update()

    this.lights.quaternion.copy(gl.camera.quaternion)
    gl.getMesh('sun_occ').quaternion.copy(gl.camera.quaternion)
    gl.getMesh('sun_def').quaternion.copy(gl.camera.quaternion)

    // gl.render()
    effects.render()
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
    effects.dispose()
  }
}
