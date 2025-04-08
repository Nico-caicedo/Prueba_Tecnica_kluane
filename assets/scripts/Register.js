// Variables locales

var turnosAsignados = []
var datosValidar = []

var GlobalIdJornada = ''
var GloblalJornadas = []
var Jornadas = []
var GlobalIdTurno = ''

// permite cargar funciones cuando carga por primera vez el sitio o por defecto cuando se recarga

window.onload = function () {
    GetRegisters();
    PassJornadas()
    LimitarFecha()


};



// funcion que inserta los turnos pero teniendo en cuenta la respuesta de la funcion valiarexistente()
function CreateResgistro() {

    var Fecha = document.getElementById('Fecha').value
    var Maquina = document.getElementById('Maquina').value
    var Proyecto = document.getElementById('Proyecto').value
    var Jornada = document.getElementById('Jornada').value
    console.log(Jornada, 'jornadid')
    if (validarExistente(Fecha, Jornada)) {
        if(validarCampos()){

            const datos = new URLSearchParams();
            datos.append('Fecha', Fecha);
            datos.append('Maquina', Maquina);
            datos.append('Proyecto', Proyecto);
            datos.append('Jornada', Jornada);
    
            fetch('./controllers/RegistrosControllers.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: datos.toString()
            })
                .then(response => response.text())
                .then(data => {
    
                    document.getElementById('Fecha').value = ''
                    document.getElementById('Maquina').value = ''
                    document.getElementById('Proyecto').value = ''
                    document.getElementById('Jornada').value = 0
                    GetRegisters();
    
    
    
                })
                .catch(error => {
                    console.error('Error en la petición:', error);
                });
        }

    }


}

function validarCampos() {
    var Fecha = document.getElementById('Fecha').value.trim();
    var Maquina = document.getElementById('Maquina').value.trim();
    var Proyecto = document.getElementById('Proyecto').value.trim();
    var Jornada = document.getElementById('Jornada').value.trim();
  
    if (!Fecha || !Maquina || !Proyecto || !Jornada) {
      alert('Todos los campos son obligatorios.');
      return false;
    }
  
    return true;
  }
  


function CreateJornada() {
    var TipoJornada = document.getElementById('TipoJornada').value
    var HoraInicio = document.getElementById('HoraInicio').value
    var HoraFin = document.getElementById('HoraFin').value

    if (TipoJornada === '') {
        alert('debe ingresar tipo de jornada')
        return false
    }


    if (!ValidarHora()) {
        return
    }
    const datos = new URLSearchParams();
    datos.append('TipoJornada', TipoJornada);
    datos.append('HoraI', HoraInicio);
    datos.append('HoraF', HoraFin);
    console.log(datos)


    fetch('./controllers/JornadaControllers.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos.toString()
    })
        .then(response => response.text())
        .then(data => {

            PassJornadas()



        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
}



// función que trae a las jornadas y las carga al select que el usuario puede usar para cargas registros
// adicional carga el contenido para la ventana modal pueda operar con datos


function PassJornadas() {

 

    document.createElement('option')

    fetch('./controllers/JornadaControllers.php')
        .then(response => response.json())
        .then(data => {
            console.log('options:', data);
            GloblalJornadas = data
            var Jornadas = data
            CargarJornadas(Jornadas)
            CargarJornadasSelect(data)

        })
        .catch(error => {
            console.error('Error al obtener las optinos:', error);
        });

}


function CargarJornadasSelect(data){
    var SeletJornadas = document.getElementById('Jornada');
    var FilterTurno = document.getElementById('Filtro_Turnos');
    var container = document.getElementById('Container_Registros');
    

    SeletJornadas.innerHTML = '<option value="0">Sin Jornada</option>';
    FilterTurno.innerHTML = `
        <option value="all">Todos</option>
        <option value="0">Sin Jornada</option>
    `;

    container.innerHTML = '';

    var JornadasActivas = data.filter(d => d.Estado == 1);
    console.log('JornadasActivas', JornadasActivas);

    if (JornadasActivas.length > 0) {
        JornadasActivas.forEach(jornada => {
            const option = document.createElement('option');
            option.value = jornada.IdJornada;
            option.textContent = jornada.Horario;
            SeletJornadas.appendChild(option);

            const filter = document.createElement('option');
            filter.value = jornada.IdJornada;
            filter.textContent = jornada.Horario;
            FilterTurno.appendChild(filter);
        });
    } else {
        container.innerHTML = 'No se encontraron tareas.';
    }
}




// limita que el usuario no pueda resgistras fechas anteriores al día presente
function LimitarFecha() {
    const fechaInput = document.getElementById('Fecha');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
    fechaInput.min = hoy;
}
// valida si existe el resgistro antes de enviarlo a la base de datos, esta información la valida con base a lo que ya se tiene cargado 

function validarExistente(fechaSeleccionada, jornadaSeleccionada) {
    console.log('Validando con:', fechaSeleccionada, jornadaSeleccionada);
    console.log('Registros cargados:', datosValidar);

    for (let registro of datosValidar) {
        // Convertimos ambos a strings para asegurar igualdad exacta
        let fechaDB = registro.Fecha; // Por si viene con hora incluida
        let jornadaDB = registro.Idjornada.toString();
        let jornadaSel = jornadaSeleccionada;

        if (jornadaSeleccionada === "0") {
            return true;
        }

        if (fechaDB === fechaSeleccionada && jornadaDB === jornadaSel) {
            alert('Ya fue asignado este turno.');
            return false;
        }
    }

    return true;
}


// funcion que permite eejecutar la ventana modal


function mostrarModal() {
    document.getElementById('Container_gestion').classList.add('modal-active');
    document.getElementById('modal-overlay').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('Container_gestion').classList.remove('modal-active');
    document.getElementById('modal-overlay').style.display = 'none';
}

// Opcional: cerrar al hacer clic fuera del modal
document.getElementById('modal-overlay').addEventListener('click', cerrarModal);


// permite cargar las jornadas que exiten, para poder gestionarlas
function CargarJornadas(Jornadas) {
    var ContainerJ = document.getElementById('Container_Jornadas');
    console.log('jornadas', Jornadas);

    ContainerJ.innerHTML = ''; // Opcional: limpia antes de cargar

    Jornadas.forEach(jornadaItem => {
        var Jornada = document.createElement('div');
        Jornada.classList.add('JornadaT');

        var Horario = document.createElement('p');
        Horario.textContent = jornadaItem.Horario;
        Horario.classList.add('JornadaJ')

        var TipoJornada = document.createElement('p');
        TipoJornada.textContent = jornadaItem.TipoJornada;

        var Acciones = document.createElement('div');
        Acciones.classList.add('AccionesJ')

        var editImg = document.createElement('img');
        editImg.src = './assets/imgs/edit.png';
        editImg.alt = 'Editar';
        editImg.classList.add('icono_edit');
        editImg.onclick = function () {
            // tu lógica de borrado aquí
            EditJornada(jornadaItem.IdJornada);
        };

        var deleteImg = document.createElement('img');
        deleteImg.src = './assets/imgs/delete.png';
        deleteImg.alt = 'Eliminar';
        deleteImg.classList.add('icono_delete');
        deleteImg.onclick = function () {
            // tu lógica de borrado aquí
            ElimiarJornada(jornadaItem.IdJornada);
        };

        var imgEstado = document.createElement('img');
      
        if(jornadaItem.Estado == 1){
          
            imgEstado.src = './assets/imgs/on.png';
            imgEstado.alt = 'Activo';
            imgEstado.classList.add('icono_Estado');
            imgEstado.onclick = function () {
                // tu lógica de borrado aquí
                DesactivarJornada(jornadaItem.IdJornada,2);
            };
        }else if (jornadaItem.Estado == 2){
            
            imgEstado.src = './assets/imgs/off.png';
            imgEstado.alt = 'Desactivo';
            imgEstado.classList.add('icono_Estado');
            imgEstado.onclick = function () {
                // tu lógica de borrado aquí
                DesactivarJornada(jornadaItem.IdJornada,1);
            };
    
    
        }
      


    
        // Jornada.appendChild(TipoJornada);
        Jornada.appendChild(Horario);

        Acciones.appendChild(editImg);
        Acciones.appendChild(deleteImg)
        Acciones.appendChild(imgEstado)
        Jornada.appendChild(Acciones);

        ContainerJ.appendChild(Jornada);
    });
}


function ValidarHora() {
    var HoraI = document.getElementById('HoraInicio').value;
    var HoraF = document.getElementById('HoraFin').value;

    if (!HoraI || !HoraF) {
        alert('Debes ingresar ambas horas.');
        return false;
    }

    // Convertimos las horas a minutos para comparar correctamente
    var [h1, m1] = HoraI.split(':').map(Number);
    var [h2, m2] = HoraF.split(':').map(Number);

    var totalMinutosInicio = h1 * 60 + m1;
    var totalMinutosFin = h2 * 60 + m2;

    if (totalMinutosFin <= totalMinutosInicio) {
        alert('La hora de salida debe ser mayor que la hora de entrada');
        return false;
    }

    return true;
}


function ElimiarJornada(IdJornada) {

    fetch('./controllers/JornadaControllers.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'DeleteID=' + encodeURIComponent(IdJornada),
    })
        .then(response => response.text())
        .then(data => {
            PassJornadas();
        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });

}




function EditJornada(IdJornada) {

    var Jornada = GloblalJornadas.filter(j => j.IdJornada === IdJornada)[0]
    console.log('jornada', Jornada)
    document.getElementById('HoraInicio').value = Jornada.JornadaInicio
    document.getElementById('HoraFin').value = Jornada.JornadaFin
    document.getElementById('TipoJornada').value = Jornada.TipoJornada

    GlobalIdJornada = Jornada.IdJornada

    document.getElementById('TipoJornada').focus()

    var BtnEdit = document.getElementById('Btn-SaveJ')
    var BtnSave = document.getElementById('BtnSaveJ')
    BtnEdit.classList.remove('Btn-hidden')
    BtnSave.classList.add('Btn-hidden')




}

function DesactivarJornada(IdJornada, nuevoEstado) {
    const datos = new URLSearchParams();
    datos.append('ModificarEstadoID', IdJornada);
    datos.append('NuevoEstado', nuevoEstado); // 0 = desactivado, 1 = activado

    fetch('./controllers/JornadaControllers.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos.toString()
    })
    .then(response => response.text())
    .then(data => {
        PassJornadas(); 
    })
    .catch(error => {
        console.error('Error en la petición:', error);
    });
}



function SaveEditJ() {
    var HoraI = document.getElementById('HoraInicio').value
    var HoraF = document.getElementById('HoraFin').value
    var TipoJornada = document.getElementById('TipoJornada').value



    const datos = new URLSearchParams();
    datos.append('HoraInicio', HoraI)
    datos.append('HoraFin', HoraF);
    datos.append('TipoJornada', TipoJornada);
    datos.append('IdJornada', GlobalIdJornada);
    console.log(datos)



    fetch('./controllers/JornadaControllers.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos.toString()
    })
        .then(response => response.text())
        .then(data => {

            PassJornadas();
            LimpiarEditJ()


        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
}

function LimpiarEditJ() {
    document.getElementById('HoraInicio').value = ''
    document.getElementById('HoraFin').value = ''
    document.getElementById('TipoJornada').value = ''


    var BtnEdit = document.getElementById('Btn-SaveJ')
    var BtnSave = document.getElementById('BtnSaveJ')
    BtnEdit.classList.add('Btn-hidden')
    BtnSave.classList.remove('Btn-hidden')



}



// funcion que permite cargar los registros de los turnos cargados
function GetRegisters() {
    fetch('./controllers/RegistrosControllers.php')
        .then(response => response.json())
        .then(data => {
            console.log('Tarea:', data);
            turnosAsignados = data
            datosValidar = turnosAsignados
            renderMes(mesActual, anioActual);

            CargarRegistros(data)
        })
        .catch(error => {
            console.error('Error al obtener las tareas:', error);
        });
}


function FiltrosRegistros() {
    var ValorFiltro = document.getElementById('Filtro_Turnos').value

    if (ValorFiltro === 'all') {
        CargarRegistros(datosValidar)
        return
    }

    var data = datosValidar
    var RegistrosFiltrados = data.filter(j => j.Idjornada === Number(ValorFiltro))
    CargarRegistros(RegistrosFiltrados)

}

function CargarRegistros(data) {
    var container = document.getElementById('Container_Registros');
    container.innerHTML = '';


    if (data.length > 0) {
        data.forEach(Resg => {
            var RegistroElement = document.createElement('div');
            RegistroElement.classList.add('registro');

            var contenidoRegistro = document.createElement('div')
            contenidoRegistro.classList.add('ContenidoR')

            var Fecha = document.createElement('p');
            Fecha.textContent = Resg.Fecha;
            Fecha.classList.add('Fecha')
            var Jornada = document.createElement('p')
            Jornada.textContent = Resg.JornadaTexto
            Jornada.classList.add('Jornada')
            var Maquina = document.createElement('p')
            Maquina.textContent = Resg.Maquina
            Maquina.classList.add('Maquinaria')
            var Proyecto = document.createElement('p')
            Proyecto.textContent = Resg.Proyecto
            Proyecto.classList.add('Proyecto')

            var Acciones = document.createElement('div');
            Acciones.classList.add('Acciones')

            var editImg = document.createElement('img');
            editImg.src = './assets/imgs/edit.png';
            editImg.alt = 'Editar';
            editImg.classList.add('icono_edit');
            editImg.onclick = function () {
                // tu lógica de borrado aquí
                EditTurno(Resg.IdTurno);
            };
            var deleteImg = document.createElement('img');
            deleteImg.src = './assets/imgs/delete.png';
            deleteImg.alt = 'Eliminar';
            deleteImg.classList.add('icono_delete');
            deleteImg.onclick = function () {
                // tu lógica de borrado aquí
                ElimiarTurno(Resg.IdTurno);
            };


            Acciones.appendChild(editImg);
            Acciones.appendChild(deleteImg);
            contenidoRegistro.appendChild(Fecha)
            contenidoRegistro.appendChild(Jornada)
            contenidoRegistro.appendChild(Maquina)
            contenidoRegistro.appendChild(Proyecto)
            contenidoRegistro.appendChild(Acciones);
            RegistroElement.appendChild(contenidoRegistro)
            container.appendChild(RegistroElement);
        });
    } else {
        container.innerHTML = 'No se encontraron registros.';
    }
}



// función que permite editar el turno que seleccione el usuario 
function EditTurno(IdTurno) {

    var Turno = datosValidar.filter(j => j.IdTurno === IdTurno)[0]

    document.getElementById('Fecha').value = Turno.Fecha;
    document.getElementById('Maquina').value = Turno.Maquina;
    document.getElementById('Proyecto').value = Turno.Proyecto;
    document.getElementById('Jornada').value = Turno.Idjornada;

    GlobalIdTurno = Turno.IdTurno

    document.getElementById('Btn-save').classList.add('Btn-hidden')
    document.getElementById('Fecha').readOnly = true
    var Btn = document.getElementById('Btn-edit')
    Btn.classList.remove('Btn-hidden')
    Btn.classList.add('Btn-Edit')



}


function SaveEdit() {

    var Maquina = document.getElementById('Maquina').value
    var Proyecto = document.getElementById('Proyecto').value
    var Jornada = document.getElementById('Jornada').value


    const datos = new URLSearchParams();
    datos.append('IdTurno', GlobalIdTurno)
    datos.append('Maquina', Maquina);
    datos.append('Proyecto', Proyecto);
    datos.append('Jornada', Jornada);
    console.log(datos)



    fetch('./controllers/RegistrosControllers.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos.toString()
    })
        .then(response => response.text())
        .then(data => {

            GetRegisters();
            LimpiarEdit()


        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
}


function LimpiarEdit() {

    document.getElementById('Fecha').value = ''
    document.getElementById('Maquina').value = ''
    document.getElementById('Proyecto').value = ''
    document.getElementById('Jornada').value = 0
    document.getElementById('Fecha').readOnly = false


    document.getElementById('Btn-save').classList.remove('Btn-hidden')
    document.getElementById('Fecha').readOnly = true
    var Btn = document.getElementById('Btn-edit')
    Btn.classList.remove('Btn-Edit')
    Btn.classList.add('Btn-hidden')

}

function ElimiarTurno(IdTurno) {
    fetch('./controllers/RegistrosControllers.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'DeleteID=' + encodeURIComponent(IdTurno),
    })
        .then(response => response.text())
        .then(data => {
            GetRegisters();
        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
}



// funciones que operan el calendario
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();


document.addEventListener("DOMContentLoaded", function () {
    renderMes(mesActual, anioActual);
});

function cambiarMes(direccion) {
    mesActual += direccion;

    if (mesActual > 11) {
        mesActual = 0;
        anioActual++;
    } else if (mesActual < 0) {
        mesActual = 11;
        anioActual--;
    }

    renderMes(mesActual, anioActual);
}

function renderMes(mes, anio) {
    const container = document.getElementById("calendarContainer");
    container.innerHTML = ""; // Limpiar
    document.getElementById("nombreMes").textContent = `${meses[mes]} ${anio}`;

    const grid = document.createElement("div");
    grid.classList.add("calendar-grid");

    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const primerDia = new Date(anio, mes, 1).getDay(); // Domingo = 0

    // Ajuste para empezar desde lunes
    const offset = primerDia === 0 ? 6 : primerDia - 1;
    for (let i = 0; i < offset; i++) {
        const espacio = document.createElement("div");
        grid.appendChild(espacio);
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = new Date(anio, mes, dia);
        const fechaStr = fecha.toISOString().split("T")[0];

        const celda = document.createElement("div");
        celda.classList.add("calendar-day");

        const numero = document.createElement("div");
        numero.classList.add("day-number");
        numero.textContent = dia;
        celda.appendChild(numero);

        const turnos = turnosAsignados.filter(t => t.Fecha === fechaStr);
        turnos.forEach(turno => {
            const turnoEl = document.createElement("div");
            turnoEl.classList.add("turno");
            turnoEl.textContent = turno.JornadaTexto;
            celda.appendChild(turnoEl);
        });

        grid.appendChild(celda);
    }

    container.appendChild(grid);
}