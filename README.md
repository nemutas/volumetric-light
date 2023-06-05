# About

This application was created as a template for postprocessing.<br />
The code corresponding to postprocessing is [here](https://github.com/nemutas/volumetric-light/tree/main/src/scripts/webgl/effects).<br />
It is based on the R3F [sample](https://codesandbox.io/s/w633u), which I love.

https://nemutas.github.io/volumetric-light/

<img src='https://github.com/nemutas/volumetric-light/assets/46724121/887e679a-aed9-40e1-b328-ed35b9b2a038' width='800' />

# References

- [Volumetric light](https://codesandbox.io/s/w633u)
- [Horse Sculpture](https://skfb.ly/owNtW)
- [Draco](https://github.com/google/draco)

# Memo

Three.jsには[DRACO Loader](https://threejs.org/docs/#examples/en/loaders/DRACOLoader)がありますが、そのまま使うとgeometryしか読み込めません。<br />
大抵の場合はMaterialも読み込みたく、その場合は[GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)にDRACOLoaderを[セットして](https://threejs.org/docs/#examples/en/loaders/GLTFLoader.setDRACOLoader)読み込ませる必要があります。
