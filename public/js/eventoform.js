document.addEventListener('DOMContentLoaded', async () => {
  const eventForm = document.getElementById('event-form');
  const imageUpload = document.getElementById('image-upload');
  const pathParts = window.location.pathname.split('/');
  const eventId = pathParts[pathParts.length - 1]; // Obtener el ID desde la URL

  let uploadedImageURL = null; // Para almacenar la URL de la imagen subida
  let endpoint = '/evento/create'; // Por defecto, crearemos un evento

  if (eventId && window.location.pathname.includes('/editar')) {
      endpoint = '/evento/edit'; // En modo edición, usamos /evento/edit
  }

  console.log('Endpoint seleccionado:', endpoint); // Depuración

  // Subir imagen al servidor
  imageUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('imagen', file);

      try {
          const response = await fetch('/evento/upload-image', {
              method: 'POST',
              body: formData,
              credentials: 'include',
          });

          const data = await response.json();
          console.log('Respuesta al subir imagen:', data);

          if (response.ok && data.image?.display_url) {
              uploadedImageURL = data.image.display_url;
              const imagePreview = document.getElementById('image-preview');
              if (imagePreview) {
                  imagePreview.src = uploadedImageURL;
              }
          } else {
              alert('Error al subir imagen. Inténtalo nuevamente.');
          }
      } catch (err) {
          console.error('Error al subir imagen:', err);
          alert('No se pudo subir la imagen. Revisa la consola para más detalles.');
      }
  });

  // Cargar datos del evento si estamos editando
  if (eventId) {
      try {
          const response = await fetch(`/evento/get/${eventId}`, { credentials: 'include' });
          const event = await response.json();

          if (response.ok) {
              document.getElementById('nombre').value = event.Nombre || '';
              document.getElementById('descripcion').value = event.Descripcion || '';
              document.getElementById('fecha').value = event.FechaHora?.split(' ')[0] || '';
              document.getElementById('hora-inicio').value = event.FechaHora?.split(' ')[1]?.slice(0, 5) || '';
              document.getElementById('hora-fin').value = event.FechaHoraFin?.split(' ')[1]?.slice(0, 5) || '';
              document.getElementById('categoria').value = event.Categoria || '';
              document.getElementById('ubicacion').value = event.Ubicacion || '';

              if (event.Imagen) {
                  const imagePreview = document.getElementById('image-preview');
                  imagePreview.src = event.Imagen;
                  uploadedImageURL = event.Imagen; // Mantener la URL de la imagen existente
              }
          } else {
              alert(event.error || 'No se pudo cargar el evento.');
          }
      } catch (err) {
          console.error('Error al cargar el evento:', err);
          alert('Ocurrió un error al cargar el evento.');
      }
  }

  // Manejar el envío del formulario
  eventForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log('Formulario enviado a:', endpoint); // Verificar el endpoint

      const nombre = document.getElementById('nombre').value.trim();
      const descripcion = document.getElementById('descripcion').value.trim();
      const fecha = document.getElementById('fecha').value;
      const horaInicio = document.getElementById('hora-inicio').value;
      const horaFin = document.getElementById('hora-fin').value;
      const categoria = document.getElementById('categoria').value;
      const ubicacion = document.getElementById('ubicacion').value;


      const fechaHoraInicio = `${fecha} ${horaInicio}:00`;
      const fechaHoraFin = `${fecha} ${horaFin}:00`;

      const body = {
          idEvento: eventId || null,
          nombre: nombre,
          descripcion: descripcion,
          imagen: uploadedImageURL || null, // URL de la imagen subida
          fechaHora: fechaHoraInicio,
          fechaHoraFin: fechaHoraFin,
          categoria: categoria,
          ubicacion: ubicacion
      };

      try {
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
              credentials: 'include',
          });

          const data = await response.json();
          console.log('Respuesta del servidor:', data); // Depuración

          if (response.ok) {
              alert(data.message || 'Operación exitosa.');
              window.location.href = '/inicio.html';
          } else {
              alert(data.error || 'Error al procesar la solicitud.');
          }
      } catch (err) {
          console.error('Error al enviar el formulario:', err);
          alert('No se pudo completar la operación. Revisa la consola para más detalles.');
      }
  });
});
