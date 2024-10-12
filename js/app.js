//variables 
const carrito = document.querySelector('#carrito');
const contenedorCarrito=document.querySelector('#lista-carrito tbody');

const vaciarCarrito=document.querySelector('#vaciar-carrito');
const listaCursos=document.querySelector('#lista-cursos');
let articulosCarrito=[];




cargarEventListeners();

function cargarEventListeners(){
    //cuando agregas un curso presionando "agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminaCurso);

    //vaciar el carrito y mandarlo alv
    vaciarCarrito.addEventListener('click', () => {
        articulosCarrito=[]; //reseteamos el arreglo
        limpiaInnerHTML(); //limpiamos el html de sus hijos
    });

    //muestra los cursos de localstorage
    document.addEventListener('DOMContentLoaded', () =>{
        articulosCarrito=JSON.parse (localStorage.getItem('carrito')) || [];
        carritoHTML();
    });
}

//primera funcion 
function agregarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')) {  //con el  if prevenimos el efecto burbuja 
        //tomando el boton y haciendo traversin the DOM para subir al padre 
        //y comenzar a seleccionar la info del card objetivo para llevar al carrito
        const cursoSeleccionado= e.target.parentElement.parentElement;

        leerDatoCurso(cursoSeleccionado);   
    }
}


//elimina un curso del carrito

function eliminaCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        const cursoId=e.target.getAttribute('data-id');
        //elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito=articulosCarrito.filter( curso => curso.id !== cursoId); //trae todos menos el que coincida con curso ID
        
        
        carritoHTML();
    }
}





//lee el contenido del HTML al que dimos click y extrae la info del curso
function leerDatoCurso(curso){ //ya tenemos el get dinamico del curso.



//ahora vamos a crear nuestro objeto solo con las propiedades que nos interesan para mandar al carrto


const infoCurso= {
    imagen:curso.querySelector('img').src,
    titulo:curso.querySelector('h4').textContent,
    precio:curso.querySelector('.precio span').textContent,
    id: curso.querySelector('a').getAttribute('data-id'),
    cantidad:1
}


/*Para actualizar una cantidad y no duplicar el mismo objeto vamos a crear unas condicionales*/
//revisa si el objeto ya existe en el carrito

const existe=articulosCarrito.some(curso => curso.id===infoCurso.id);
if(existe){
    //actualizamos la cantidad 
    const cursos = articulosCarrito.map (curso => {
        if(curso.id === infoCurso.id){
            curso.cantidad++;
            return curso;
        }else{
            return curso; 
        }
    });
    articulosCarrito= [...cursos];    
}else{//como no existe cae en este else y lo crea
    //arregla elementos al aarreglo de carrito
    articulosCarrito= [...articulosCarrito, infoCurso]; //es importante usar una copia con los puntos para no perder los otros cursos que ya agregamos
}

carritoHTML();

}





//ya que tenemos la refrencia y el arreglo vamos a preparar el carrito de compras en el html. 
function carritoHTML(){
    limpiaInnerHTML();
    articulosCarrito.forEach(curso => {
        const {imagen, titulo, precio, cantidad, id}=curso;
        const tabla = document.createElement('TR');
        tabla.innerHTML = `
        <td>
                <img src="${imagen}" width="100"
        </td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
 
        <td>
            <a href="#" class="borrar-curso"  data-id="${id}"> X</a>
        </td>`
        contenedorCarrito.appendChild(tabla);
 
       
        
        
    });


    //agregar el carrito de compras al storage
    sincronizarStorage();
}


    function sincronizarStorage(){
       localStorage.setItem('carrito', JSON.stringify(articulosCarrito) );
    }


function limpiaInnerHTML(){

    //forma lenta
    //contenedorCarrito.innerHTML='';

    //forma rapida

    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }


    //lo que hace el codigo anterior es que el padre eliminara un hijo, por el metodo de eliminacion por el primer hijo
    //asta quedar solo el padre (asta que se vuelva false el true), de esa forma eliminas mas rapido que con innerhtml=''
    /*
    <div>
        <p>1</p>
        <p>2</p>
        <p>3</p>
    </div>
    */
}
