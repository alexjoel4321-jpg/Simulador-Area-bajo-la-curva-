// ================================
// SIMULADOR DEL ÁREA BAJO LA CURVA
// ================================

// ---------- Elementos ----------
const funcionInput = document.getElementById("funcion");
const aInput = document.getElementById("a");
const bInput = document.getElementById("b");
const slider = document.getElementById("n");
const metodo = document.getElementById("metodo");

const valorN = document.getElementById("valorN");

const areaAprox = document.getElementById("aprox");
const areaExacta = document.getElementById("exacta");
const errorTexto = document.getElementById("error");
const deltaXTexto = document.getElementById("deltaX");
const formula = document.getElementById("formulaTexto");
const tabla = document.getElementById("tablaBody");

// -------------------------------

slider.addEventListener("input", actualizar);

funcionInput.addEventListener("input", actualizar);

aInput.addEventListener("input", actualizar);

bInput.addEventListener("input", actualizar);

metodo.addEventListener("change", actualizar);

document
.getElementById("graficar")
.addEventListener("click", actualizar);

actualizar();

// ================================

function actualizar(){

    valorN.innerHTML = slider.value;

    graficar();

}

// ================================

function graficar(){

    const expresion = funcionInput.value;

    const f = math.compile(expresion);

    const a = Number(aInput.value);

    const b = Number(bInput.value);

    const n = Number(slider.value);

    //-------------------------
    // Curva completa
    //-------------------------

    let x=[];

    let y=[];

    for(let i=-10;i<=10;i+=0.05){

        x.push(i);

        y.push(

            f.evaluate({x:i})

        );

    }

    const curva={

        x:x,

        y:y,

        mode:"lines",

        name:"f(x)",

        line:{

            width:3

        }

    };

    //-------------------------
    // Área sombreada
    //-------------------------

    let xs=[];

    let ys=[];

    for(let i=a;i<=b;i+=(b-a)/150){

        xs.push(i);

        ys.push(

            f.evaluate({x:i})

        );

    }

    xs.push(b);

    xs.push(a);

    ys.push(0);

    ys.push(0);

    const sombreado={

        x:xs,

        y:ys,

        fill:"toself",

        type:"scatter",

        fillcolor:"rgba(0,150,255,0.35)",

        line:{

            color:"rgba(0,0,0,0)"

        },

        name:"Área"

    };

    //-------------------------
    // Rectángulos
    //-------------------------

    let figuras=[];

    let area=0;

    let dx=(b-a)/n;

    tabla.innerHTML = "";

    deltaXTexto.innerHTML = dx.toFixed(5);

    for(let i=0;i<n;i++){

        let xi;

        if(metodo.value==="izquierda"){

            xi=a+i*dx;

        }

        if(metodo.value==="derecha"){

            xi=a+(i+1)*dx;

        }

        if(metodo.value==="medio"){

            xi=a+(i+0.5)*dx;

        }

        let h=f.evaluate({x:xi});

        area+=h*dx;

let fila = `
<tr>
    <td>${i+1}</td>
    <td>${xi.toFixed(4)}</td>
    <td>${h.toFixed(4)}</td>
    <td>${(h*dx).toFixed(4)}</td>
</tr>
`;

tabla.innerHTML += fila;

        if(metodo.value!=="trapecio"){

            figuras.push({

                type:"rect",

                x0:a+i*dx,

                x1:a+(i+1)*dx,

                y0:0,

                y1:h,

                line:{

                    color:"red"

                },

                fillcolor:"rgba(255,0,0,0.25)"

            });

        }

    }

    //-------------------------
    // Trapecios
    //-------------------------

    if(metodo.value==="trapecio"){

        area=0;

        for(let i=0;i<n;i++){

            let x0=a+i*dx;

            let x1=x0+dx;

            let y0=f.evaluate({x:x0});

            let y1=f.evaluate({x:x1});

            area+=(y0+y1)/2*dx;

            figuras.push({

                type:"line",

                x0:x0,

                x1:x1,

                y0:y0,

                y1:y1,

                line:{

                    color:"red",

                    width:2

                }

            });

        }

    }

    //-------------------------
    // Área de referencia
    //-------------------------

    let exacta=0;

    let pasos=5000;

    let d=(b-a)/pasos;

    for(let i=0;i<pasos;i++){

        let xi=a+(i+0.5)*d;

        exacta+=

        f.evaluate({x:xi})*d;

    }

    //-------------------------
    // Error
    //-------------------------

    let error=

    Math.abs(area-exacta);
if(metodo.value==="izquierda"){

    formula.innerHTML =
    "$$A\\approx\\sum_{i=0}^{n-1}f(x_i)\\Delta x$$";

}

if(metodo.value==="derecha"){

    formula.innerHTML =
    "$$A\\approx\\sum_{i=1}^{n}f(x_i)\\Delta x$$";

}

if(metodo.value==="medio"){

    formula.innerHTML =
    "$$A\\approx\\sum_{i=0}^{n-1}f\\left(x_i+\\frac{\\Delta x}{2}\\right)\\Delta x$$";

}

if(metodo.value==="trapecio"){

    formula.innerHTML =
    "$$A\\approx\\frac{\\Delta x}{2}\\left[f(x_0)+2\\sum f(x_i)+f(x_n)\\right]$$";

}

MathJax.typesetPromise();

    //-------------------------

    areaAprox.innerHTML=

    area.toFixed(6);

    areaExacta.innerHTML=

    exacta.toFixed(6);

    errorTexto.innerHTML=

    error.toExponential(3);

    //-------------------------

    Plotly.newPlot(

        "grafica",

        [

            sombreado,

            curva

        ],

        {

            title:"Área bajo la curva",

            shapes:figuras,

            showlegend:true,

            xaxis:{

                range:[-1+Math.min(a,-1),Math.max(4,b+1)],

                zeroline:true

            },

            yaxis:{

                zeroline:true

            }

        },

        {

            responsive:true

        }

    );

}

document
.getElementById("descargar")
.addEventListener("click",()=>{

Plotly.downloadImage(

"grafica",

{

format:"png",

filename:"Area_bajo_la_curva",

height:700,

width:1000

}

);

});