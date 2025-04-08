<?php

require_once '../models/conexion.php';
require_once '../models/JornadaModels.php';

class JornadasController
{


    public function GetJornadas()
    {
        global $conexion;


        $taskObj = new Jornada($conexion);
        $taskObj->GetJornadas();
    }


    public function CreateJornada($data)
    {
        global $conexion;

        $taskObj = new Jornada($conexion);
        return $taskObj->Create(
            $data['TipoJornada'],
            $data['HoraI'],
            $data['HoraF']
        );
    }

    public function DeleteJornada($data)
    {

        global $conexion;
        $taskObj = new Jornada($conexion);
        return $taskObj->Delete(
            $data['IdJornada'],

        );
    }


    public function EditJornada($data)
    {

        global $conexion;
        $taskObj = new Jornada($conexion);
        return $taskObj->Edit(
            $data['IdJornada'],
            $data['TipoJornada'],
            $data['HoraI'],
            $data['HoraF']

        );
    }

    public function DesactiveJornada($data)
    {
        global $conexion;
        $taskObj = new Jornada($conexion);
        return $taskObj->Desactive(
            $data['IdJornada'],
            $data['Estado']

        );
    }
}


if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $controller = new JornadasController();
    $controller->GetJornadas();  // Llamamos a la función que obtiene las tareas
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['TipoJornada'], $_POST['HoraI'], $_POST['HoraF'])) {
    $controller = new JornadasController();
    $response = $controller->CreateJornada([
        'TipoJornada' => $_POST['TipoJornada'],
        'HoraI' => $_POST['HoraI'],
        'HoraF' => $_POST['HoraF'],

    ]);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['TipoJornada'], $_POST['HoraInicio'], $_POST['HoraFin'], $_POST['IdJornada'])) {
    $controller = new JornadasController();
    $response = $controller->EditJornada([
        'TipoJornada' => $_POST['TipoJornada'],
        'HoraI' => $_POST['HoraInicio'],
        'HoraF' => $_POST['HoraFin'],
        'IdJornada' => $_POST['IdJornada']


    ]);
}



if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['DeleteID'])) {
    $controller = new JornadasController();
    $response = $controller->DeleteJornada(['IdJornada' => $_POST['DeleteID']]);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['ModificarEstadoID'], $_POST['NuevoEstado'])) {
    $controller = new JornadasController();
    $response = $controller->DesactiveJornada(['IdJornada' => $_POST['ModificarEstadoID'], 'Estado' => $_POST['NuevoEstado']]);
}
