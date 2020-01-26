import Regl from 'regl'
import { h } from 'hyperapp'
import angleNormals from 'angle-normals'
import mat4 from 'gl-mat4'

let _il = 0

class WordCount extends HTMLParagraphElement {
    constructor() {
      // Always call super first in constructor
      super();
  
      // Element functionality written in here
        console.log('made wordcount')
    }
  }

const loadView = (data) => function(canvas){
    console.log('loadView',canvas)
    const regl = Regl({
        attributes: {
            antialias: true,
            alpha: true,
            depth: true
        },
        canvas: canvas,
        extensions: [
            'angle_instanced_arrays',
            // 'WEBGL_debug_renderer_info',
            // 'WEBGL_debug_shaders'
        ]
    })

    const fbo = regl.framebuffer({
        color: regl.texture({
            width: 1,
            height: 1,
            wrap: 'clamp'
        }),
        depth: true
    })

    var N = 10 // N triangles on the width, N triangles on the height.

    var angle = []
    for (var i = 0; i < N * N; i++) {
        // generate random initial angle.
        angle[i] = Math.random() * (2 * Math.PI)
    }

    // This buffer stores the angles of all
    // the instanced triangles.
    const angleBuffer = regl.buffer({
        length: angle.length * 4,
        type: 'float',
        usage: 'dynamic'
    })

    const draw = regl({
        frag: `
            precision mediump float;

            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor, 1.0);
            }`,

        vert: `
            precision mediump float;

            attribute vec2 p;

            // These three are instanced attributes.
            attribute vec3 color;
            attribute vec2 offset;
            attribute float angle;

            uniform mat4 view;
            uniform mat4 projection;
            uniform vec2 resolution;
            uniform vec2 mouse;
            varying vec3 vColor;

            void main() {
                vec2 position = p;//p * resolution;
                gl_Position = vec4(
                cos(angle) * position.x + sin(angle) * position.y + offset.x,
                    position.y + offset.y, 0, 1) * view;
                // gl_Position = vec4(p, 0, 1) * projection;
                vColor = color;
            }`,
        attributes: {
            p: [[-0.05, -0.05], [0.1, -0.05], [0.1, 0.05], [-0.05, 0.05]],

            offset: {
                buffer: regl.buffer(
                    Array(N * N).fill().map((_, i) => {
                        var x = -1 + 2 * Math.floor(i / N) / N + 0.1
                        var y = -1 + 2 * (i % N) / N + 0.1
                    return [x, y]
                    })),
                divisor: 1 // one separate offset for every triangle.
            },

            color: {
                buffer: regl.buffer(
                    Array(N * N).fill().map((_, i) => {
                        var r = Math.floor(i / N) / N
                        var g = (i % N) / N
                    return [r, g, r * g + 0.2]
                    })),
                divisor: 1 // one separate color for every triangle
            },

            angle: {
                buffer: angleBuffer,
                divisor: 1 // one separate angle for every triangle
            }
        },

        depth: {
            enable: false
        },
        cull: {
            enable: false
        },
        blend: {
            enable: true,
            //func: { srcRGB: 'src alpha', dstRGB: 'one minus src alpha', srcAlpha: 1, dstAlpha: 'one minus src alpha' }, //1
            // func: {src: 1, dst: 'one minus src alpha'}, //2
            func: { src: 'src alpha', dst: 'one minus src alpha' },
            //func: { srcRGB: 'dst color', dstRGB: 0, srcAlpha: 1, dstAlpha: 1 },
            // func: {src: 'one minus dst alpha', dst: 'src color'}, //never got this working correctly with opacities, but it does look like a multiply blend
            //func: {src: 'dst color', dst: 'one minus src alpha'}, //seems to work for Pixi, but I just get a white screen...
            equation: { rgb: 'add', alpha: 'add' },
        },
        // Every triangle is just three vertices.
        // However, every such triangle are drawn N * N times,
        // through instancing.
        count: 4,
        instances: N * N,
        primitive: 'line loop'
    })
    const drawFboBlurred = regl({
        vert: `
            precision mediump float;
            attribute vec2 position;
            varying vec2 uv;
            void main () {
                uv = position;
                gl_Position = vec4(2.0 * position - 1.0, 0.0, 1.0);
            }
        `,
        frag: `
            precision mediump float;
            uniform sampler2D tex;
            uniform float t;
            varying vec2 uv;
            void main () {
                gl_FragColor = vec4(texture2D(tex, uv).rgb, 0.9);
            }

        `,
        attributes: {
          position: [ -4, -4, 4, -4, 0, 4 ]
        },
        uniforms: {
          tex: ({count}) => fbo,
          resolution: regl.prop('resolution')
        },
        depth: { enable: false },
        count: 3
    })
    const setupDefault = regl({
        cull: {
          enable: false
        },
        uniforms: {
            resolution: regl.prop('resolution'),
            mouse: regl.prop('mouse'),
            tick: ({tick}) => Math.cos(tick*0.03),
            model: mat4.identity([]),
            view: ({tick}) => {
              const t = 0.02 * tick
              return mat4.lookAt([],
                [0, 20 * Math.cos(t), 20 * Math.sin(t)],
                [0, 0, 0],
                [0, 1, 0])
            },
            projection: ({viewportWidth, viewportHeight}) =>
              mat4.perspective([],
                Math.PI / 4,
                viewportWidth / viewportHeight,
                0.01,
                1000
              )
        },
        framebuffer: fbo
    })
    let mousePosition = [0, 0]
    canvas.addEventListener('mousemove',({ clientX, clientY }) =>
        mousePosition = [clientX, clientY])
    //fbo.resize(canvas.width, canvas.height)
    regl.frame(({deltaTime, viewportWidth, viewportHeight}) => {
        fbo.resize(viewportWidth, viewportHeight)
        for (var i = 0; i < N * N; i++) {
            angle[i] += 0.01
        }
        angleBuffer.subdata(angle)
        setupDefault({ mouse: mousePosition, resolution: [viewportWidth, viewportHeight] }, () => {
            regl.clear({
                color: [0, 0, 0, 1],
                depth: 1
            })
            draw()
        })
        drawFboBlurred({ mouse: mousePosition, resolution: [viewportWidth, viewportHeight]})
    })
}

export default ({data}) => {

    let lid = `gantt_${_il++}`
    requestAnimationFrame(()=>{
        let _p = document.querySelector(`#${lid} > canvas`)
        let onResize = function(){
            try{
                let {width, height} = _p.parentElement.getBoundingClientRect()
                _p.width = Math.ceil(width)
                _p.height = Math.ceil(_p.width * window.devicePixelRatio * 0.5)
            }catch{
                return false
            }
            return true
        }
        onResize() && window.addEventListener('resize',onResize)

        loadView(data)(_p)
        _p.animate([
            {opacity: 0},
            {opacity: 1}
        ], {
            duration: 500
        }).onfinish = (_e) =>
            _p.style.opacity = 1
    })
    
    return {
        props: {
            data,
            id: lid,
            class: 'popout',
        },
        name: 'article',
        children: [ (<canvas style={{opacity: 0}}></canvas>)],
    }
}