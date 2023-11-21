const HALF_PI = Math.PI / 2
const TAU = Math.PI * 2
//
const FACES_PER_TURN = 64
const THICKNESS = 4
const TURNS = 10
const RADIUS = 3
const LENGTH = 10
//
let camera, scene, renderer
let geometry, material, mesh
//
function init() {
    scene = new THREE.Scene()
    //
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.z = 20
		//
    renderer = new THREE.WebGLRenderer({
        antialias: true,
				alpha: true
    })
		//
		const light = new THREE.AmbientLight(0xFFFFFF, 3)
		scene.add(light)
		const h_light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 )
		scene.add( h_light )
		//
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(renderer.domElement)
		//
    geometry = new THREE.PlaneGeometry(TURNS * TAU, THICKNESS, TURNS * FACES_PER_TURN, FACES_PER_TURN)
		material = new THREE.MeshDepthMaterial({
			fog: 0xFF00FF,
			side: THREE.DoubleSide,
			transparent: true,
			wireframe: false
		})
		mesh = new THREE.Mesh(geometry, material)
		mesh.rotation.set(-HALF_PI, 0, 0)
		scene.add(mesh)
	
		helix()
    //
    window.addEventListener('resize', onWindowResize)
		onWindowResize()
}

function helix() {
	const position = geometry.attributes.position
	const vtx = new THREE.Vector3()
	//
	for (let i = 0; i < position.count; i += 1) {
		vtx.fromBufferAttribute( position, i )
		vtx.applyMatrix4( mesh.matrixWorld )
		let angle = -vtx.x;
		let _radius = RADIUS + vtx.z
		//
		position.array[i * 3] = Math.cos(angle) * _radius
		position.array[i * 3 + 1] = vtx.y + (vtx.x / TAU) * LENGTH
		position.array[i * 3 + 2] = Math.sin(angle) * _radius
	}	
	geometry.computeVertexNormals()
	geometry.center()
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
}

function animate() {
    requestAnimationFrame(animate)
    render()
}

function render() {
    const time = Date.now() * 0.001
    renderer.render(scene, camera)
		mesh.rotation.y += 0.01
}

init()
animate()