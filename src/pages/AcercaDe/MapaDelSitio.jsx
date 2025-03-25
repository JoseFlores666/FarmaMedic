import { FaUserMd, FaBookMedical, FaMapMarkerAlt, FaVial } from "react-icons/fa";

const MapaDelSitio = () => {
    return (
        <div className="container mx-auto mt-10 px-4">

            <h1 className="text-3xl font-bold text-center mb-6">Mapa del Sitio</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg shadow-md p-6 ">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <FaUserMd className="text-blue-600" />
                        Atención Médica en Mayo Clinic
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Atención médica centrada en el paciente</li>
                        <li>Información sobre Mayo Clinic</li>
                        <li>Pedir una cita</li>
                        <li>Encuentra un médico</li>
                        <li>Ubicaciones</li>
                        <li>Ensayos clínicos</li>
                    </ul>
                </div>

                <div className="border rounded-lg shadow-md p-6 ">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <FaBookMedical className="text-green-600" />
                        Biblioteca de la Salud
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Enfermedades y afecciones</li>
                        <li>Síntomas</li>
                        <li>Análisis y procedimientos</li>
                        <li>Medicamentos y suplementos</li>
                        <li>Estilo de vida saludable</li>
                        <li>Libros y suscripciones</li>
                    </ul>
                </div>

                <div className="border rounded-lg shadow-md p-6 ">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <FaMapMarkerAlt className="text-red-600" />
                        Ubicaciones
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Sedes principales</li>
                        <li>Hospitales afiliados</li>
                        <li>Opciones de atención virtual</li>
                    </ul>
                </div>

                <div className="border rounded-lg shadow-md p-6 ">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <FaVial className="text-purple-600" />
                        Ensayos Clínicos
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Investigaciones activas</li>
                        <li>Cómo participar</li>
                        <li>Últimos avances médicos</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MapaDelSitio;
