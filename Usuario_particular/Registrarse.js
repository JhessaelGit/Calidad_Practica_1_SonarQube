import { verificar_ci, verificar_contrasenia, verificar_correo, verificar_nombre } from "../Verificar_datos_registro/Verificar_campos.js";
const nombre_usuario = document.querySelector("#nombre-usuario");
const ci_usuario = document.querySelector("#ci-usuario");
const correo_usuario = document.querySelector("#correo-usuario");
const contrasenia_usuario = document.querySelector("#contrasenia-usuario");
const boton_registrarse = document.querySelector("#registrar-button")
const formulario_registrarse = document.querySelector("#registrar-form")

boton_registrarse.addEventListener("click", (event) => {
  event.preventDefault();
  const nombre_usuario_value = nombre_usuario.value;
  const ci_usuario_value = ci_usuario.value;
  const correo_usuario_value = correo_usuario.value;
  const contrasenia_usuario_value = contrasenia_usuario.value;

  const todos_los_campos_son_validos = verificar_nombre(nombre_usuario_value) && verificar_ci(ci_usuario_value) && verificar_correo(correo_usuario_value) && verificar_contrasenia(contrasenia_usuario_value);
  if (todos_los_campos_son_validos){
    //routing
    window.location.href = "./Usuario_particular/lista_surtidores.html";
    //console.log("Redirigiendo a lista_surtidores.html");
    //window.location.href = "./Usuario_Administrador_Surtidor/registro_admin.html";
  }
  else{
    alert("Por favor, ingrese los datos correctamente, los campos no deven estar vacios y debe poner un correo valido")
  }

});
