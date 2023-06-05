import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexShader from '../shader/vertex.glsl'
import fragmentShader from '../shader/additiveBlendingFrag.glsl'
import * as THREE from 'three'

export class AdditiveBlendingPass extends ShaderPass {
  constructor(additiveTexture: THREE.Texture) {
    const shader: THREE.Shader = {
      uniforms: {
        tDiffuse: { value: null },
        tAdd: { value: null },
      },
      vertexShader,
      fragmentShader,
    }

    super(shader)
    this.uniforms.tAdd.value = additiveTexture
  }
}
