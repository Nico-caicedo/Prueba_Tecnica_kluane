<?php

require_once '../models/conexion.php';
require_once '../models/RegistroModels.php';


class RegistroControllers{

    public function GetRegisters(){
        global $conexion; 
        
  
        $taskObj = new Registro($conexion);
        $taskObj->getRegistersdb();  
    }

    public function saveRegistro($data)
    {
        global $conexion; // Usamos la conexión global definida en db.php
        $taskObj = new Registro($conexion);  // Pasamos la conexión a la clase
        return $taskObj->save(
            $data['Fecha'],
            $data['Maquina'],
            $data['Proyecto'],
            $data['Jornada']
        );
    }

    public function EditRegistro($data)
    {
        global $conexion; // Usamos la conexión global definida en db.php
        $taskObj = new Registro($conexion);  // Pasamos la conexión a la clase
        return $taskObj->Edit(
            $data['IdTurno'],
            $data['Maquina'],
            $data['Proyecto'],
            $data['Jornada']
        );
    }

    public function DeleteRegistro($data){

        global $conexion; // Usamos la conexión global definida en db.php
        $taskObj = new Registro($conexion);  // Pasamos la conexión a la clase
        return $taskObj->Delete(
            $data['IdTurno'],
          
        );
    }
    

}



if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $controller = new RegistroControllers();
    $controller->GetRegisters();  // Llamamos a la función que obtiene las tareas
}if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['Fecha'], $_POST['Maquina'], $_POST['Proyecto'], $_POST['Jornada'])) {
    $controller = new RegistroControllers();
    $response = $controller->saveRegistro([
        'Fecha' => $_POST['Fecha'],
        'Maquina' => $_POST['Maquina'],
        'Proyecto' => $_POST['Proyecto'],
        'Jornada' => $_POST['Jornada']
    ]);
   
}
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['IdTurno'],$_POST['Maquina'], $_POST['Proyecto'], $_POST['Jornada'])) {
    $controller = new RegistroControllers();
    $response = $controller->EditRegistro([
        'IdTurno' => $_POST['IdTurno'],
        'Maquina' => $_POST['Maquina'],
        'Proyecto' => $_POST['Proyecto'],
        'Jornada' => $_POST['Jornada']
    ]);
   

   
}


if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['DeleteID'])) {
    $controller = new RegistroControllers();
    $response = $controller->DeleteRegistro(['IdTurno' => $_POST['DeleteID']]);
   
}