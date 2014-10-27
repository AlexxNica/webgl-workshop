var VERT_SRC = "\
attribute vec3 position;\
\
varying vec3 color;\
\
void main() {\
  vec2 np = position.xy;\
  color = normalize(vec3(\
    dot(np, vec2(1,0)),\
    dot(np, vec2(-0.5, 0.8660254037844386)),\
    dot(np, vec2(-0.5,-0.8660254037844386))));\
  gl_Position = vec4(position,1);\
}"

var FRAG_SRC = "\
precision mediump float;\
\
varying vec3 color;\
\
void main() {\
  vec3 fcolor = color - min(color.x,min(color.y,color.z));\
  gl_FragColor = vec4(fcolor / max(fcolor.x,max(fcolor.y,fcolor.z)),1);\
}"

function compileShader(gl, type, src) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}

module.exports = function setup(gl) {
  var fragShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
  var vertShader = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC)

  var program = gl.createProgram()
  gl.attachShader(program, fragShader)
  gl.attachShader(program, vertShader)

  gl.bindAttribLocation(program, 0, 'position')
  gl.linkProgram(program)

  gl.useProgram(program)

  var uTime = gl.getUniformLocation(program, 't')
  gl.uniform1f(uTime, 0.3)

  var vertices = [0,0,1]
  for(var i=0; i<=128; ++i) {
    var theta = i * 2.0 * Math.PI / 128
    vertices.push(Math.cos(theta), Math.sin(theta), 0)
  }

  var buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, 
    new Float32Array(vertices), 
    gl.STATIC_DRAW)

  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
  
  return function(t) {
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 130)
  }
}