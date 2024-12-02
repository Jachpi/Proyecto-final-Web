// Obtener elementos
const registerLink = document.getElementById('register-link');
const registerModal = document.getElementById('register-modal');
const closeModal = document.getElementById('close-modal');


registerLink.addEventListener('click', (e) => {
    e.preventDefault(); 
    registerModal.style.display = 'flex';
});


closeModal.addEventListener('click', () => {
    registerModal.style.display = 'none';
});


window.addEventListener('click', (e) => {
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

const logInButton = document.getElementById("btn-login")
const nombre = document.getElementById("username")
const psswd = document.getElementById("password")
const badLogTxt = document.getElementsByClassName("bad-login-text")[0]
let badLogEnphasize = false

logInButton.addEventListener("click", async function () {
  const nameTxt = nombre.value.trim()
  const psswdTxt = psswd.value.trim()
    if (nameTxt == "" || psswdTxt == ""){
      alert("Debes completar todos los campos")
      return
    }
    try{
      const resp = await fetch('http://localhost:3000/log-in',{
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({name : nameTxt, password: psswdTxt})
      });
      console.log(resp)

      if(resp.ok){
        console.log("Usuario existe!")
      }else{
        console.log("Usuario no existe")
        if(!badLogEnphasize){
          badLogTxt.className = "bad-login-text-active"
          badLogEnphasize = true
        }else{
          badLogTxt.className = "bad-login-text-active2"
          setTimeout(() => {
            badLogTxt.className = "bad-login-text-active"
          },250)
        }
        
      }
    }catch (err){
      console.log(err)
    }
})