console.log('hola mundo!');

// var es como se declaraba en ES5, const y let en ES6
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban";

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre;
}

//Crear una promesa, recibe como parametro resolve y reject
const getUser = new Promise(function(todoBien, todoMal) {
  //llamar a un API, deberia estar condicionado 
  // setInterval
  // setTimeout
  setTimeout(() => {
    //luego de 3s ejecuta:
    // todoBien("todo bien");
    todoMal("todo mal");
  }, 3000);
});

//Consumir una promesa
getUser
  .then(function(msn) { 
    //maneja cuando la promesa funciona correctamente.
    console.log("funcionando bien el setTimeOut y then");
  })
  .catch(function(msn) {
    //maneja cuando hay un error en la promesa.
    console.log("Simulando capturar un error");
  })

//Consumir varias promesas a la vez.
//El then se ejecutan cuando terminen todas las promesas.
//El catch se ejecuta en el primer error.
// Promise.all([
//   promesa1,
//   promesa2
// ])
// .then(function() {})
// .catch(function() {})

// //Se ejecuta el then de la promesa que termine primero.
// Promise.race([
//   promesa1,
//   promesa2
// ])
// .then(function() {})
// .catch(function() {})


//JQUERY
// $.ajax("https://randomuser.me/api/", {
//   method: "GET", //POST, PUT, DELETE
//   success: function(data) {
//     //se ejecuta cuando todo sale bien
//     //data: lo que devuelve el api
//     console.log(data);
//   },
//   error: function(error) {
//     //se ejecuta cuando hay un error
//     //error: mensaje de error del api
//   }
// });

//fetch reemplaza a AJAX para jalar datos de algun lado y  devuelve una promesa
fetch('https://randomuser.me/api/ab34')
  .then( function(response){
    // console.log(response);
    return response.json(); //tambien devuelve una promesa
  })
  //este then pertenece a la promesa return
  .then(function(user){
    console.log("user: ", user.results[0].name.first);
  })
  .catch(function(error){
    console.log('algo fallo');
  });

  //AQUI INICIA EL CODIGO DE LA PAGINA ######################################################################
  (async function load(){

  //los (function)() son para que la funcion se autoejecute
  // la funcion async devuelve una promesa, con await pauso la app hasta obtener un resultado y ya no necesitaria usar then y catch
  
  // debugger
  const $featuringContainer = document.querySelector('#featuring');
  
  const $form = document.querySelector('#form');
  const BASE_API = 'https://yts.am/api/v2/';
  $form.addEventListener('submit', async (event) => {
    // debugger
    // preventDefault para que no se recargue toda la pagina
    event.preventDefault();
    $home.classList.add('search-active');
    //crea un elemento html
    const $loader = document.createElement('img');
    setAtributes($loader, {
      src : 'src/images/loader.gif',
      height: 50,
      width:50,
    });
    //el elemento append funciona si es un elemento html el que se agrega, siendo string mostrara el string
    $featuringContainer.append($loader);
    //obtiene lo que esta dentro del form 
    const data = new FormData($form);
    //debo saber que quiero sacar ej: name="name" del input (por si hubiesen mas)
    //hago async la funcion para usar el await
    //query_term= es del API
    // const peli = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
    // const HTMLString = featuringTemplate(peli.data.movies[0]);

    //Desestructurando el objeto, ver arriba como estaba y abajo la soluccion
    //Explicacion: entrar a un objeto que tiene objetos para llegar a un key que es lo que realmente ocupo
    try {
      const {
        data: {
          movies: peli
        }
      } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
      const HTMLString = featuringTemplate(peli[0]);
      // debugger
      //siempre la busqueda reemplazara todo lo que hay
      $featuringContainer.innerHTML=HTMLString; 
    } catch (error) {
      alert(error.message);
      $loader.remove();
      $home.classList.remove('search-active');
    }
  });

  function featuringTemplate(peli){
    return(`
      <div class="featuring">
        <div class="featuring-image">
          <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${peli.title}</p>
        </div>
      </div>
    `);
  }

  function setAtributes($element, atributes){
    for(const attr in atributes){
      $element.setAttribute(attr, atributes[attr])
    }
    // donde src, height y width son attr y cada valor atributes[attr]
    // {
    //   src : 'src/images/loader.gif',
    //   height: 50,
    //   width:50,
    // }
  }

  const $home = document.querySelector('#home');

  //Retorna un elemento con el id modal
  const $modal= document.getElementById('modal');
  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');
  const $hideModal= document.getElementById('hide-modal');
  const $overlay= document.getElementById('overlay');

    async function getData(url){
      const response = await fetch(url);
      const data= await response.json();
      if(data.data.movie_count > 0 ){
        return data;
      }
      throw new Error('No se encontró ningún resultado');
    }

    function videoItemTemplate(movie, category){
      return(
        //importantisimo el data-id y data-category para usar dataset luego y obtener los valores
        `<div class="primaryPlaylistItem" data-id=${movie.id} data-category=${category}>
          <div class="primaryPlaylistItem-image">
            <img src="${movie.medium_cover_image}">
          </div>
          <h4 class="primaryPlaylistItem-title">
            ${movie.title}
        </div>`
      );
    }
    // console.log(videoItemTemplate('src/images/cover/bitcoin.jpg','Bitcoin'));

    // #### haciendolo solo para un tipo, modificado a funcion para reutilizar
    // actionList.data.movies.forEach((movie) => {
    //   const HTMLString = videoItemTemplate(movie);
    //   // convertimos el string que tenemos en html y se lo concatenamos a un contenedor del DOM
    //innerHTML solo funciona si hay algo en el contenedor, falla si esta vacio
    //   $actionContainer.innerHTML = $actionContainer.innerHTML + HTMLString;
    // });
    //FUNCIONA IGUAL QUE EL CURSO PERO MAS PEQUENIO
    // function renderMovieList(list, $container){
    //   $container.children[0].remove();
    //   list.forEach((movie) => {
    //     const HTMLString = videoItemTemplate(movie);
    //     // convertimos el string que tenemos en html y se lo concatenamos a un contenedor del DOM
    //     $container.innerHTML = $container.innerHTML + HTMLString;
    //   });
    // }

    
    function createTemplate(HTMLString) {
      const html = document.implementation.createHTMLDocument();
      html.body.innerHTML = HTMLString;
      // console.log("PROBANDO ",html.body.innerHTML);
      return html.body.children[0];
    }
  
    function renderMovieList(list, $container, category) {
      $container.children[0].remove();
      list.forEach((movie) => {
        //HTMLString recibe texto plano
        const HTMLString = videoItemTemplate(movie, category);
        //createTemplate le pasamos el texto plano para que lo converta en html
        const movieElement = createTemplate(HTMLString);
        $container.append(movieElement);
        // agrego una clase CSS que contiene una animacion
        // movieElement.classList.add('fadeIn');

        //haciendo la animacion solo para la imagen
        const image = movieElement.querySelector('img');
        image.addEventListener('load',(event)=>{
          //event.quien lo lanzo = image
          event.srcElement.classList.add('fadeIn');
        })
        addEventClick(movieElement);
      });
    }
    function addEventClick($element){
      $element.addEventListener('click', function(){
        // alert("Click");
        showModal($element);
      });
    }
    function showModal($element){
      $overlay.classList.add('active');
      // agrega un style inline, puede ser cualquier propiedad CSS
      $modal.style.animation = 'modalIn .8s forwards';
      const id= $element.dataset.id;
      const category= $element.dataset.category;
      const findMovieData = findMovie(id, category);
      
      //h1
      $modalTitle.textContent = findMovieData.title;
      //img
      $modalImage.setAttribute('src', findMovieData.medium_cover_image);
      //p
      $modalDescription.textContent = findMovieData.description_full;
    }
    function findMovie(id, category){
      switch(category){
        case 'action':{
          return findById(actionList,id);
        }
        case 'drama':{
          return findById(dramaList,id);
        }
        case 'animation':{
          return findById(animationList,id);
        }
        default:{

        }
      }
    }
    function findById(list, id){
      return list.find((movie) => {
        return movie.id === parseInt(id,10);
      })
    }


    $hideModal.addEventListener('click', hideModal);
    function hideModal(){
      $overlay.classList.remove('active');
      // quita un style inline, puede ser cualquier propiedad CSS
      $modal.style.animation = 'modalOut .8s forwards';
    }

    //CREANDO CACHE o CARGANDO CACHE SI EXISTE
    //localStorage.clear() limpia el cache
    async function cacheExist(category){
      const listName = `${category}List`;
      //getItem devuelve String
      const cacheList = window.localStorage.getItem(listName);
      if (cacheList) {
        //SI tiene algo devuevo el resultado poro convertido en un objeto
        return JSON.parse(cacheList);
      }
      const {data: {movies: data}} = await getData(`${BASE_API}list_movies.json?genre=${category}`);
      window.localStorage.setItem(listName, JSON.stringify(data));
      return data;
    }

    //###Usando async await, no continua mientra no termine
    //por eso he reordenado el codigo para que haga la peticion y muestre, luego vaya a la otra peticion
    // const {data: {movies: actionList}} = await getData(`${BASE_API}list_movies.json?genre=action`);
    const actionList = await cacheExist('action');
    // window.localStorage.setItem("actionList", JSON.stringify(actionList));
    const $actionContainer = document.querySelector('#action');
    renderMovieList(actionList, $actionContainer, 'action');

    const dramaList= await cacheExist(`drama`);
    // window.localStorage.setItem("dramaList", JSON.stringify(dramaList));
    const $dramaContainer = document.getElementById('drama');
    renderMovieList(dramaList, $dramaContainer, 'drama');

    const animationList = await cacheExist(`animation`);
    // window.localStorage.setItem("animationList", JSON.stringify(animationList));
    const $animationContainer = document.querySelector('#animation');
    renderMovieList(animationList, $animationContainer, 'animation');
    // console.log(dramaList.data.movies);
    //detiene la ejecucion para revisar como va
    // debugger

    

    //Retorna una lista de elementos con la clase modal
    // document.getElementsByClassname("modal")

    //Retorna una lista de elementos con el tag div
    // document.getElementsByTagName("div")
    
    //Devuelve el primer elemento que coincida con el query de búsqueda.
    // document.querySelector("div .home #modal")

    //Devuelve todos los elementos que coincidan con el query de búsqueda.
    // document.querySelectorAll("div .home #modal")

    //###Usando promesa devuelta por la funcion
    // let terrorList;
    // getData('https://yts.am/api/v2/list_movies.json?genre=action')
    //   .then(function(data){
    //     terrorList=data
    //     console.log('terrorList: ',terrorList);
    //   })
    //   .catch(function(){
    //     console.log('error en terrorList');
    //   });
  })();

