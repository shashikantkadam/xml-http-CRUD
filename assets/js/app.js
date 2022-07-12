let cl = console.log;
let myPosts = document.getElementById('myPosts')
let stdForm = document.getElementById('stdForm');
let title = document.getElementById('title');
let Info = document.getElementById('Info');
let submit = document.getElementById('submit');
let update = document.getElementById('update');
let postsUrl = 'https://jsonplaceholder.typicode.com/posts';

let postArray =[];
function fetchData(methodName,url,tempfun,data){
let xhr = new XMLHttpRequest();
xhr.open(methodName,url);
xhr.onload = function(){
   //cl (xhr.response);
   if((xhr.status=== 200 || xhr.status === 201) && xhr.readyState === 4 ){
    if(methodName == 'GET'){
        postArray = JSON.parse(xhr.response);
        tempfun(postArray)
    }
   }
   if(xhr.status === 404){
    alert('something went wrong')
   }
   
}
xhr.send(data);
}
fetchData('GET',postsUrl,templating)

function templating(arr){
    let result ='';
    arr.forEach(element => {
        result +=`
        <div class="card mb-3" data-id="${element.id}">
            <div class="card-body">
                <h1>${element.title}</h1>
                 <p>${element.body}</p>
                <p class="text-right">
                 <button class=" btn btn-success" onclick = onEditHandler(this)>Edit</button>
                 <button class=" btn btn-danger" onclick = onDeleteHandler(this)>Delete</button>
                <p>
             </div>
            
        </div> 
        
        `
    });
    myPosts.innerHTML = result;
}



function onsubHandler (e){
    e.preventDefault();
    let obj ={
        title : title.value,
        body : Info.value
    }
  //  cl(obj)
    postArray.unshift(obj);
    templating(postArray)
    stdForm.reset()
    fetchData('post',postsUrl,JSON.stringify(obj))
}

function onEditHandler(ele){
  //  cl(ele.closest('.card').dataset.id)
  let getId = +ele.closest('.card').dataset.id;
  localStorage.setItem('userId',getId)
  let getobj = postArray.find(p =>{
    return getId == p.id
  })
  title.value = getobj.title;
  Info.value = getobj.body;
  update.classList.remove('d-none');
  submit.classList.add('d-none');
};
function updateHandler(e){
    cl(e.target)
    let getId =localStorage.getItem('userId')
  //  cl(getId)
    let updateUrl =`${postsUrl}/${getId}`
    let obj ={
        title: title.value,
        body : Info.value
    }
    postArray.forEach(o =>{
        if(o.id ==getId){

           o.title=title.value;
            o.body = Info.value
        }
    })
    templating(postArray)
    fetchData('PATCH',updateUrl,JSON.stringify(obj));
    stdForm.reset();
    update.classList.add('d-none');
    submit.classList.remove('d-none');
}
update.addEventListener('click', updateHandler)
stdForm.addEventListener('submit', onsubHandler)
function onDeleteHandler(d){
   // cl(d)
   let getId = +d.closest('.card').dataset.id;
   cl(getId)
   let deleteUrl =`${postsUrl}/${getId}`
   postArray = postArray.filter(ele =>{
         return getId !== ele.id;   
   })
   templating(postArray);
   fetchData('DELETE',deleteUrl,templating)
}
//update.addEventListener('click', updateHandler)
//stdForm.addEventListener('submit', onsubHandler)