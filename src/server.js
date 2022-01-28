const e = require('express');
const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closure
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure

// TODO: your code to handle requests
server.post('/posts' ,(req,res)=> {
  const {author,title, contents}=req.body;
  if  (author && title && contents){
    const newPost= {
      id:newId(),
      author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  }else{
    return res.status(STATUS_USER_ERROR).json({
      error: 'No se recibieron los parámetros necesarios para crear el Post',
  
    });
  }    

});


server.post('/posts/author/:author' ,(req,res)=> {
  const {title, contents} = req.body;
  const author=req.params.author;
  
   if (title && contents){
    const newPost= {
      id:newId(),
      author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  }else{
    return res.status(STATUS_USER_ERROR).json({
      error: 'No se recibieron los parámetros necesarios para crear el Post',
  
    });
  }    

});


server.get("/posts", (req,res) => {
  const term= req.query.term;
  if (term) {
    const aciertos = posts.filter(e =>
      e.title.includes(term) || e.contents.includes(term))
      return res.json(aciertos)
  }else{
    return res.json(posts);
  }

});

server.get("/posts/:author", (req,res) => {
  const term= req.params.author;
  if (term) {
    const aciertos = posts.filter(e =>
      e.author.includes(term));
      if ( aciertos.length>0){
        return res.json(aciertos)
      }else{
        return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado" })
      }
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado" })
  }
});

server.get("/posts/:author/:title", (req,res) => {
  const author= req.params.author;
  const title= req.params.title;
  
    if  (author && title){
      const aciertos = posts.filter(e =>
        e.author.includes(author) && e.title.includes(title));
      if (aciertos.length>0){
          return res.json(aciertos);
      }else{
        return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"});
      }
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"});
  }  
});

server.put("/posts", (req,res) => {
  const {id,title, contents}=req.body;
  if  (id && title && contents){
      const coincidencia = posts.find(e=>e.id===id);
      if (coincidencia){
        coincidencia.title=title;
        coincidencia.contents= contents;
        return res.json(coincidencia);
      }else{
        return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con el id indicado"});
      }
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"});
  }  

});

server.delete('/posts', (req, res) => {
  const{id}  = req.body;

  if (id) {
    const post = posts.find(e => e.id === id);
    
    if (post) {
      posts = posts.filter(e=>e.id !== post.id);
      res.json({ success: true });
    } else {
      res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
    }

  } else {
    res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
  }
});

server.delete('/author', (req,res)=>{
  const {author} = req.body;
  if(author){
    const post = posts.find(e => e.author === author);
    if(post){
      posts = posts.filter(e=>e.author === post.author);
      res.json(posts);
    }
    else{
      res.status(STATUS_USER_ERROR).json({ error: "No existe el autor indicado" });  
    }
  }else{
    res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
  }
});





module.exports = { posts, server };
