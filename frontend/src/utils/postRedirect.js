/**
 * Realiza una redirección POST a una URL específica con datos
 * Esto evita la pantalla en blanco que puede ocurrir con redirecciones GET normales
 *
 * @param {string} url - URL de destino
 * @param {object} data - Datos a enviar en el POST
 */
export const postRedirect = (url, data = {}) => {
  // Crear un formulario HTML dinámico
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = url
  form.style.display = 'none'

  // Agregar los datos como campos hidden del formulario
  Object.keys(data).forEach(key => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = data[key]
    form.appendChild(input)
  })

  // Agregar el formulario al DOM, enviarlo y luego removerlo
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}