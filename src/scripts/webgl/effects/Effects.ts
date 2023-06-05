import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { gl } from '../core/WebGL'
import { GodRayPass } from './GodRayPass'
import { GammaCorrectionPass } from './GammaCorrectionPass'
import { FXAAPass } from './FXAAPass'
import * as THREE from 'three'
import { AdditiveBlendingPass } from './AdditiveBlendingPass'

class Effects {
  private composer!: EffectComposer
  private occlusionRenderTarget!: THREE.WebGLRenderTarget
  private occlusionComposer!: EffectComposer
  private fxaaPass = new FXAAPass(gl.size.width, gl.size.height)

  constructor() {
    this.init()
  }

  private init() {
    this.occlusionRenderTarget = new THREE.WebGLRenderTarget(gl.size.width, gl.size.height, { samples: 10 })
    this.occlusionComposer = new EffectComposer(gl.renderer, this.occlusionRenderTarget)
    this.occlusionComposer.renderToScreen = false
    this.occlusionComposer.addPass(new RenderPass(gl.scene, gl.camera))
    this.occlusionComposer.addPass(new GodRayPass(false))

    this.composer = new EffectComposer(gl.renderer)
    this.composer.addPass(new RenderPass(gl.scene, gl.camera))
    this.composer.addPass(new GammaCorrectionPass())
    this.composer.addPass(this.fxaaPass)
    this.composer.addPass(new AdditiveBlendingPass(this.occlusionRenderTarget.texture))
  }

  resize() {
    const { width, height } = gl.size
    this.composer.setSize(width, height)
    this.occlusionComposer.setSize(width, height)
    this.fxaaPass.resize(width, height)
  }

  render() {
    gl.camera.layers.set(gl.OCCLUSION_LAYER)
    this.occlusionComposer.render()

    gl.camera.layers.set(gl.DEFAULT_LAYER)
    this.composer.render()
  }

  dispose() {
    this.composer.passes.forEach((pass) => pass.dispose())
    this.occlusionComposer.passes.forEach((pass) => pass.dispose())
    this.occlusionRenderTarget.dispose()
    this.composer.dispose()
    this.occlusionComposer.dispose()
  }
}

export const effects = new Effects()
