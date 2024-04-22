import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/***********
 ** SETUP **
 **********/
// Sizes 
const sizes = {
    width: window.innerWidth / 2.5, 
    height: window.innerWidth / 2.5,
    aspectRatio: 1
}

 /**********
  ** SCENE **
  **********/
// Canvas 
const canvas = document.querySelector('.webgl2')

// Scene 
const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(0, 0, 20)
scene.add(camera)

// Renderer 
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls 
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** LIGHTS **
 ***********/
//Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/************
** MESHES **
************/
// Sphere Geometry
const sphereGeometry = new THREE.SphereGeometry(0.5)

// Sphere Materials
const redMaterial = new THREE.MeshBasicMaterial({ 
    color: new THREE.Color('orange')
})
const greenMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('pink')
})
const blueMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('aqua')
})

const drawSphere = (i, material) => 
{
    const sphere = new THREE.Mesh(sphereGeometry, material)
    sphere.position.x = (Math.random() - 0.5) * 10
    sphere.position.z = (Math.random() - 0.5) * 10
    sphere.position.y = i - 10

    sphere.rotation.x = Math.random() * 2 * Math.PI
    sphere.rotation.y = Math.random() * 2 * Math.PI
    sphere.rotation.z = Math.random() * 2 * Math.PI

    scene.add(sphere)
}


/******************
 ** TEXT PARSERS + UI **
 *****************/
 let preset = {}
 
 const uiobj = {
    text: '',
    textArray: [],
    term1: 'dudley',
    term2: 'snape',
    term3: 'malfoy',
    rotateCamera: false,
    animateBubbles: false
 }

 // Text Parsers
      // Parse Text and Terms
      const parseTextandTerms = () =>
      {
        // Strip periods and downcase text
        const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()
        

        // Tokenize text
        uiobj.textArray = parsedText.split(/[^\w']+/)
        

        // Find term 1
        findTermInParsedText(uiobj.term1, redMaterial)

        // Find term 2
        findTermInParsedText(uiobj.term2, greenMaterial)

        // Find term 3
        findTermInParsedText(uiobj.term3, blueMaterial)

      }

      const findTermInParsedText = (term, material) =>
      {
        for(let i=0; i < uiobj.textArray.length; i++)
        {
            
            if(uiobj.textArray[i] === term)
            {
                
                // convert i into n, which is a value between 0 and 20
                const n = (100 / uiobj.textArray.length) * i * 0.2

                // call drawSphere function 5 times using converted n value
                for(let a=0; a < 5; a ++)
                {
                    drawSphere(n, material)
                }

            }
        }
      }

      // Load source text 
 fetch("https://gist.githubusercontent.com/phillipj/4944029/raw/75ba2243dd5ec2875f629bf5d79f6c1e4b5a8b46/alice_in_wonderland.txt")
 .then(response => response.text())
 .then((data) =>
 {
   uiobj.text = data 
   parseTextandTerms()
 }
 ) 

      // UI
      const ui = new dat.GUI({
        container: document.querySelector('#parent2')
      })
    
    // Interaction Folders
        // Spheres Folder
        const spheresFolder = ui.addFolder('Filter Terms')

        spheresFolder
            .add(redMaterial, 'visible')
            .name(`${uiobj.term1}`)

        spheresFolder
            .add(greenMaterial, 'visible')
            .name(`${uiobj.term2}`)

        spheresFolder
            .add(blueMaterial, 'visible')
            .name(`${uiobj.term3}`)

         spheresFolder
         .add(uiobj, 'animateBubbles')
         .name('Animate Bubbles')

        // Camera Folder
        const cameraFolder = ui.addFolder('Camera')

        cameraFolder
            .add(uiobj, 'rotateCamera')
            .name('Rotate Camera')

/********************
  ** ANIMATION LOOP **
********************/
const clock = new THREE.Clock()

// Animate 
const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Orbit Controls
    controls.update()

    // Camera Rotation
    if(uiobj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.2) * 16
        camera.position.z = Math.cos(elapsedTime * 0.2) * 16
    }

    // Animate Bubbles
    if(uiobj.animateBubbles){
        for(let i=0; i < scene.children.length; i++)
        {
            if(scene.children[i].type === "Mesh")
            {
                scene.children[i].scale.x = Math.sin(elapsedTime * scene.children[i].randomizer)
                scene.children[i].scale.y = Math.sin(elapsedTime * scene.children[i].randomizer)
                scene.children[i].scale.z = Math.sin(elapsedTime * scene.children[i].randomizer)
            }
        }
    }

    //Renderer
    renderer.render(scene, camera)

    // Request mext frame 
    window.requestAnimationFrame(animation)
}

animation()
