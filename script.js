//Controlador dexie.js -> Crear la base de datos NoSQL
const db = new Dexie('BD_ListaCompras')

//Creación de la base de datos a partir de una primera colección (almacén)
db.version(1).stores({items: '++id,nombre,precio,cantidad,comprado'})

//Referencias
const formulario = document.getElementById('formulario')
const listaMercado = document.getElementById('listaMercado')
const precioTotal = document.getElementById('precio_total')
const btnAgregar = document.getElementById('agregar')



//Crear elementos -> evento envío del formulario
btnAgregar.addEventListener('click', async (e) =>{

  //e.preventDefault();
  
  let nombre=document.getElementById('nombre').value;
  let cantidad=document.getElementById('cantidad').value;
  let precio=document.getElementById('precio').value;
  await db.items.add({nombre,
                      cantidad,
                      precio,
                      comprado:false});

  await poblarListaItems()
  /*nombre.value = ''
  cantidad.value = ''
  precio.value = ''*/
  formulario.reset()
  
})



const poblarListaItems = async () => {
  const itemsCompletos = await db.items.reverse().toArray()
  listaMercado.innerHTML = itemsCompletos.map(item => `
      <div class="item-lista ${item.comprado ? 'comprado': ''}">
        <input type="checkbox" id="check"
        onchange = "alternarItem(event,${item.id})"
        ${item.comprado ? 'checked': ''}
        >
        <div class="producto-info">
          <p id="nombre-producto">${item.nombre}</p>
          <div class="producto-numeros">
            <p id="precio-producto">$${item.precio}</p>
            <p id="cantidad-producto"> x${item.cantidad}</p>
          </div>
        </div>
        <button id="eliminar-producto" 
        onclick="eliminarItem(${item.id})">x</button>
      </div>
    </div>
  `).join('')

  //Cálculo del precio total
  const actualizarPrecioTotal = itemsCompletos.map(item => 
  item.cantidad * item.precio                                                
  )
  const precioTotalActualizado=actualizarPrecioTotal.reduce((a,b)=>a+b,0)

  precioTotal.innerText=precioTotalActualizado
  
}

const alternarItem = async (e, id) => {
  let estado
  if(e.target.checked){
    estado = true
  }else{
    estado = false
  }

  await db.items.update(id, {comprado: estado})
  await poblarListaItems() 
}

const eliminarItem = async (id) => {
  await db.items.delete(id)
  await poblarListaItems() 
}







/*
const actualizarPrecioTotal = async () => {
  const itemPrecio = await db.items.reverse().toArray()
  precioTotal.innerHTML = itemPrecio.map(item => `

      <div class="footer">
        <p>Precio total: $</p>
        <p id="precio_total">${item.precio}</p>
      </div>  
  `)
}
*/


//Asociar a la carga de la aplicación
window.onload = poblarListaItems

/*
const itemSeleccionado(item) = > {
  let currentItem = document.getElementById(item);
  currentItem.style.setProperty("text-decoration", "line");
  currentItem.style.setProperty("background-color", "green");
}
  */