// js/eventoform.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1) REFERENCIAS A LOS ELEMENTOS DEL FORM ---
    const eventForm = document.getElementById('event-form');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
  
    // Variable para almacenar la imagen codificada en Base64
    let base64Image = null;
  
    // --- 2) MANEJO DE LA IMAGEN: LEER Y MOSTRAR VISTA PREVIA ---
    if (imageUpload && imagePreview) {
      imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          // Verificar que sea un archivo de imagen
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              // e.target.result es una cadena "data:image/...;base64,AAA..."
              base64Image = e.target.result;
              // Mostrar vista previa en el <img>
              imagePreview.src = base64Image;
            };
            reader.readAsDataURL(file);
          } else {
            alert('Por favor, selecciona un archivo de imagen válido.');
            imagePreview.src = './img/placeholder.jpg'; // Restaurar placeholder
            base64Image = null;
          }
        } else {
          // Si quitan o cancelan la imagen, volvemos al placeholder
          imagePreview.src = './img/placeholder.jpg';
          base64Image = null;
        }
      });
    }
  
    // --- 3) ENVÍO DEL FORMULARIO: CAMPOS NORMALES + IMAGEN EN BASE64 ---
    if (eventForm) {
      eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        // Crear un FormData con TODOS los campos del formulario
        const formData = new FormData(event.target);
  
        // Sustituir el campo 'imagen' (que sería el archivo) por la cadena Base64
        // 1. Borramos el archivo original (que vendría en 'imagen' si existiese)
        formData.delete('imagen');
        // 2. Añadimos la misma key 'imagen', pero con el valor Base64
        if (base64Image) {
          formData.append('imagen', base64Image);
        } else {
          formData.append('imagen', ''); 
        }
  
        // Hacemos la petición a tu endpoint de creación de eventos
        fetch('/evento/create', {
          method: 'POST',
          body: formData,
          // Si necesitas la cookie de sesión:
          // credentials: 'include'
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Respuesta del servidor:', data);
            if (data.error) {
              alert(data.error);
            } else {
              alert(data.message || 'Evento creado exitosamente');
              // Redirigir si quieres:
              // window.location.href = '/inicio.html';
            }
          })
          .catch((error) => {
            console.error('Error al enviar el formulario:', error);
            alert('Ocurrió un error al enviar el formulario. Intenta de nuevo.');
          });
      });
    }
  });
  