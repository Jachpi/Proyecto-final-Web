
// Carga la imagen seleccionada en el input file en el placeholder
document.getElementById('image-upload').addEventListener('change', function(event) {
    console.log('Evento change detectado');
    const file = event.target.files[0]; // Obtén el archivo seleccionado
    if (file) {
        console.log('Archivo seleccionado:', event.target.files[0]);
        console.log('Tipo de archivo:', file?.type);
        // Verificar que sea un archivo de imagen
        if (file.type.startsWith('image/')) {
            const reader = new FileReader(); // Crea un lector de archivos

            reader.onload = function(e) {
                // Cuando la imagen esté cargada, actualiza el src del placeholder
                const imagePreview = document.getElementById('image-preview');
                imagePreview.src = e.target.result;
            };
            

            reader.readAsDataURL(file); // Lee el archivo como una URL de datos
        } else {
            alert('Por favor selecciona un archivo de imagen válido.');
        }
    }
});