import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexShader from '../shader/vertex.glsl'
import fragmentShader from '../shader/godrayFrag.glsl'
import * as THREE from 'three'
import { gui } from '../utils/Gui'

export class GodRayPass extends ShaderPass {
  constructor(needSwap = true) {
    const shader: THREE.Shader = {
      uniforms: {
        tDiffuse: { value: null },
        lightPosition: { value: new THREE.Vector2(0.5, 0.6) },
        exposure: { value: 1 },
        decay: { value: 0.95 },
        density: { value: 0.7 },
        weight: { value: 0.05 },
        samples: { value: 100 },
      },
      vertexShader,
      fragmentShader,
    }

    super(shader)
    this.needsSwap = needSwap
    this.setControls()
  }

  private setControls() {
    const add = (name: string, min = 0, max = 1, step = 0.01) => {
      gui.add(this.uniforms[name], 'value', min, max, step).name(name)
    }

    add('exposure')
    add('decay')
    add('density')
    add('weight')
    add('samples', 10, 100, 10)
  }
}
