<?php

class Registro
{

    private $conexion;


    public function __construct($conexion)
    {

        $this->conexion = $conexion;
    }


    public function getRegistersdb()
    {
        $stmt = $this->conexion->prepare("
   SELECT 
    t.IdTurno,
    t.Fecha,
    t.Maquina,
    t.Proyecto,
    t.Idjornada,
    COALESCE(j.TipoJornada, 'Sin Jornada') AS TipoJornada,
    j.JornadaInicio,
    j.JornadaFin
FROM Turnos t
LEFT JOIN Jornadas j ON t.IdJornada = j.IdJornada
WHERE t.Estado = 1;

");

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $Resg = [];

            while ($row = $result->fetch_assoc()) {
                // Formateamos la hora de inicio y fin (solo hora y minutos en formato 24h)
                $horaInicio = date("H:i", strtotime($row['JornadaInicio']));
                $horaFin = date("H:i", strtotime($row['JornadaFin']));

                if ($row['Idjornada'] != '0') {
                    $row['JornadaTexto'] = "{$row['TipoJornada']} - {$horaInicio} a {$horaFin}";
                } else {
                    $row['JornadaTexto'] = "Sin Jornada";
                }

                $Resg[] = $row;
                // Creamos el texto de la jornada

            }

            header('Content-Type: application/json');
            echo json_encode($Resg);
        } else {
            header('Content-Type: application/json');
            echo json_encode(["error" => "Error al obtener los turnos."]);
        }
    }


    public function save($fecha, $maquina, $proyecto, $jornada)
    {
        $estado = 1;
        // Aquí preparamos la consulta de inserción
        $stmt = $this->conexion->prepare("INSERT INTO Turnos (Fecha, maquina, proyecto, IdJornada,Estado) VALUES (?,?,?,?,?)");
        $stmt->bind_param("ssssi", $fecha, $maquina, $proyecto, $jornada, $estado);  // Vinculamos el parámetro de tarea como tipo 'string'

        if ($stmt->execute()) {
            return true;
        } else {
            return "Algo falló al guardar la tarea.";
        }
    }

    public function Edit($IdTurno, $maquina, $proyecto, $jornada)
    {

        $stmt = $this->conexion->prepare("UPDATE Turnos SET Maquina = ?, Proyecto = ?, IdJornada = ? WHERE IdTurno = ?");

        // Vinculamos los parámetros correctamente
        $stmt->bind_param("sssi", $maquina, $proyecto, $jornada, $IdTurno); // 'i' para el IdTurno si es numérico

        // Ejecutamos la consulta
        if ($stmt->execute()) {
            return true;
        } else {
            return "Algo falló al actualizar el turno: " . $stmt->error;
        }
    }

    public function Delete($IdTurno)
    {
        $estado = 0;

        if (!$this->conexion) {
            return "Error de conexión con la base de datos.";
        }

        $stmt = $this->conexion->prepare("UPDATE Turnos SET Estado = ? WHERE IdTurno = ?");

        if (!$stmt) {
            return "Error al preparar la consulta: " . $this->conexion->error;
        }

        $stmt->bind_param("ii", $estado, $IdTurno);

        if ($stmt->execute()) {
            return true;
        } else {
            return "Algo falló al actualizar el turno: " . $stmt->error;
        }
    }
}
