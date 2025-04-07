<?php



class Jornada
{

    private $conexion;


    public function __construct($conexion)
    {

        $this->conexion = $conexion;
    }

    public function GetJornadas()
    {
        // Preparamos la consulta
        $stmt = $this->conexion->prepare("SELECT * FROM Jornadas WHERE Estado = 1");

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $Jornadas = [];

            while ($row = $result->fetch_assoc()) {
                // Formatear horas desde la fecha completa
                $inicio = date("g A", strtotime($row["JornadaInicio"])); // Ej: 10:08 AM
                $fin = date("g A", strtotime($row["JornadaFin"]));       // Ej: 10:08 PM

                $Jornadas[] = [
                    "IdJornada" => $row["IdJornada"],
                    "TipoJornada" => $row["TipoJornada"],
                    "Horario" => $row["TipoJornada"] . " - " . $inicio . " a " . $fin
                ];
            }

            header('Content-Type: application/json');
            echo json_encode($Jornadas);
        } else {
            header('Content-Type: application/json');
            echo json_encode(["error" => "Error al obtener las jornadas."]);
        }
    }


    public function Create($TipoJornada,$HoraI,$HoraF){
        $estado = 1;
        // Aquí preparamos la consulta de inserción
        $stmt = $this->conexion->prepare("INSERT INTO jornadas (TipoJornada, JornadaInicio, JornadaFin,Estado) VALUES (?,?,?,?)");
        $stmt->bind_param("sssi", $TipoJornada, $HoraI, $HoraF, $estado);  // Vinculamos el parámetro de tarea como tipo 'string'

        if ($stmt->execute()) {
            return true;
        } else {
            return "Algo falló al guardar la tarea.";
        }
    }

    public function Edit(){

    }

    public Function Delete($IdJornada){
        $estado = 0;
    
        if (!$this->conexion) {
            return "Error de conexión con la base de datos.";
        }
    
        $stmt = $this->conexion->prepare("UPDATE Jornadas SET Estado = ? WHERE IdJornada = ?");
    
        if (!$stmt) {
            return "Error al preparar la consulta: " . $this->conexion->error;
        }
    
        $stmt->bind_param("ii", $estado, $IdJornada);
    
        if ($stmt->execute()) {
            return true;
        } else {
            return "Algo falló al actualizar el turno: " . $stmt->error;
        }

    }

    public Function Desactive(){

    }
}
