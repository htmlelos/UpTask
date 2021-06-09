import Swal from 'sweetalert2';
import axios from 'axios';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
  tareas.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-check-circle')) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;

      // Peticion hacia /tareas/id
      const url = `${location.origin}/tareas/${idTarea}`;

      axios.patch(url, { idTarea }).then(function (respuesta) {
        if (respuesta.status === 200) {
          icono.classList.toggle('completo');

          actualizarAvance();
        }
      });
    }

    if (e.target.classList.contains('fa-trash')) {
      const tareaHtml = e.target.parentElement.parentElement;
      const idTarea = tareaHtml.dataset.tarea;

      Swal.fire({
        title: '¿Deseas borrar esta Tarea?',
        text: 'Una tarea eliminada no se puede recuperar',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar',
        cancelButtonText: 'No, Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          // Enviar el delete por medio de axios
          const url = `${location.origin}/tareas/${idTarea}`;
          axios.delete(url, {params: { idTarea }})
          .then(function(respuesta) {
            if (respuesta.status === 200) {
              // Eliminar el nodo
              tareaHtml.parentElement.removeChild(tareaHtml);

              // Opcional alerta
              Swal.fire('Tarea Eliminada'),
              respuesta.data,
              'success'
            };

            actualizarAvance();
          })
        }
      });
    }
  });
}

export default tareas;
