// js/eventoform.js

document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('event-form');
    const imageUpload = document.getElementById('image-upload');
  
    // Variable para guardar la URL de la imagen subida
    let uploadedImageURL = null;

    imageUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
      
        const formData = new FormData();
        formData.append('imagen', file);
      
        const response = await fetch('/evento/upload-image', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        const data = await response.json();
        console.log('Respuesta backend:', data);

        if (data.status_code === 200) {
          // Guardar la URL en la variable global
          uploadedImageURL = data.image.display_url;
      
          // Actualizar el src del placeholder
          const imagePreview = document.getElementById('image-preview');
          if (imagePreview) {
            imagePreview.src = uploadedImageURL; 
          }
        } else {
          alert('Error al subir imagen');
        }
      });
      
  
    // 2) Enviar el formulario (sin imagen, solo la URL) a tu backend
    eventForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      // Recoger otros campos del formulario
      const nombre = document.getElementById('nombre').value.trim();
      const descripcion = document.getElementById('descripcion').value.trim();
      const fecha = document.getElementById('fecha').value;         // p. ej. "2025-01-01"
      const horaInicio = document.getElementById('hora-inicio').value; // p. ej. "22:00"
      const horaFin = document.getElementById('hora-fin').value;
      const categoria = document.getElementById('categoria').value;
  
      // Estructura "YYYY-MM-DD HH:mm:ss"
      const fechaHoraInicio = `${fecha} ${horaInicio}:00`;
      const fechaHoraFin = `${fecha} ${horaFin}:00`;
  
      // Hacer la petición POST a tu servidor
      fetch('/evento/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          // La URL que obtuvimos de Freeimage.host
          imagen: uploadedImageURL || null,
  
          // Fechas con el formato que necesitas
          fechaHora: fechaHoraInicio,
          fechaHoraFin: fechaHoraFin,
  
          categoria,
          estado: 'Pendiente', // o el que desees
        }),
        // Si tu servidor utiliza sesiones, añade:
        // credentials: 'include'
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Respuesta del servidor (create event):', data);
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message || 'Evento creado exitosamente');
            // Redirigir o lo que desees
            window.location.href = '/inicio.html';
          }
        })
        .catch((err) => {
          console.error('Error al enviar el formulario al servidor:', err);
          alert('No se pudo crear el evento. Revisa la consola para más detalles.');
        });
    });
  });
  