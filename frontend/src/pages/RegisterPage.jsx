import { useForm } from 'react-hook-form';
import { motion } from "motion/react"
import { registerRequest } from '../services/auth';

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (values) => {
        console.log(values);
        const res = await registerRequest(values);
        console.log(res);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full flex flex-col md:flex-row">

                {/* Ilustración */}
                <div className="hidden md:flex items-center justify-center w-1/2">
                    <img src="https://source.unsplash.com/400x400/?technology" alt="Ilustración" className="rounded-xl" />
                </div>

                {/* Formulario */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Registro de Usuario</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Nname User */}
                        <div>
                            <label className="block text-gray-700">Nombre de Usuario</label>
                            <input 
                                type="text" 
                                {...register("username", { required: "El nombre de usuario es obligatorio" })} 
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-gray-700">Correo Electrónico</label>
                            <input 
                                type="email" 
                                {...register("email", { 
                                    required: "El correo es obligatorio",
                                    pattern: { 
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                                        message: "El formato del correo no es válido"
                                    }
                                })} 
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-700">Contraseña</label>
                            <input 
                                type="password" 
                                {...register("password", { 
                                    required: "La contraseña es obligatoria", 
                                    minLength: { value: 8, message: "La contraseña debe tener al menos 8 caracteres" }
                                })} 
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <motion.button 
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
                            Registrarse
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default RegisterPage;
