// ANTIGUO

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../api/axios";

// Esquema de validación mejorado
const registerSchema = yup.object({
  nombre: yup.string().required('Nombre es requerido').min(2, 'Mínimo 2 caracteres'),
  apellido: yup.string().required('Apellido es requerido').min(2, 'Mínimo 2 caracteres'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  contraseña: yup.string()
    //.min(6, 'Mínimo 6 caracteres')
    //.matches(/[a-z]/, 'Debe contener al menos una minúscula')
    //.matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
    //.matches(/[0-9]/, 'Debe contener al menos un número')
    .required('Contraseña es requerida'),
  confirmar: yup.string()
    .oneOf([yup.ref('contraseña'), null], 'Las contraseñas no coinciden')
    .required('Debes confirmar tu contraseña'),
  rol: yup.string().oneOf(['cliente', 'emprendedor'], 'Rol inválido').required()
});

export default function RegistroCombinado() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Obtener rol de query params si existe
  const query = new URLSearchParams(location.search);
  const rolQuery = query.get("rol") || 'cliente';

  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      rol: rolQuery
    }
  });

  // Sincronizar valor del rol con query param
  useEffect(() => {
    setValue('rol', rolQuery);
  }, [rolQuery, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await API.post("/api/auth/registro", {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.contraseña,
        rol: data.rol,
      });

      if (response.data.success) {
        alert("¡Registro exitoso!");
        navigate("/loginForm");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         "Error en el registro";
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {rolQuery === 'emprendedor' ? 'Registro para Emprendedores' : 'Crear cuenta'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {rolQuery === 'emprendedor' 
            ? 'Comienza a mostrar tus productos/servicios' 
            : 'Descubre los mejores emprendimientos locales'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {serverError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{serverError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  {...register('nombre')}
                  className={`mt-1 block w-full border ${errors.nombre ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors.nombre && (
                  <p className="mt-2 text-sm text-red-600">{errors.nombre.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  {...register('apellido')}
                  className={`mt-1 block w-full border ${errors.apellido ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors.apellido && (
                  <p className="mt-2 text-sm text-red-600">{errors.apellido.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                {...register('email')}
                className={`mt-1 block w-full border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  id="contraseña"
                  name="contraseña"
                  type="password"
                  {...register('contraseña')}
                  className={`mt-1 block w-full border ${errors.contraseña ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors.contraseña && (
                  <p className="mt-2 text-sm text-red-600">{errors.contraseña.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmar" className="block text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmar"
                  name="confirmar"
                  type="password"
                  {...register('confirmar')}
                  className={`mt-1 block w-full border ${errors.confirmar ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors.confirmar && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmar.message}</p>
                )}
              </div>
            </div>

            {!query.get("rol") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de cuenta
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`inline-flex items-center p-3 border rounded-lg cursor-pointer ${errors.rol ? 'border-red-300' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      {...register('rol')}
                      value="cliente"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Cliente</span>
                  </label>
                  <label className={`inline-flex items-center p-3 border rounded-lg cursor-pointer ${errors.rol ? 'border-red-300' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      {...register('rol')}
                      value="emprendedor"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Emprendedor</span>
                  </label>
                </div>
                {errors.rol && (
                  <p className="mt-2 text-sm text-red-600">{errors.rol.message}</p>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </>
                ) : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/loginForm')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Iniciar sesión
              </button>
            </div>

          </div>
        </div>
            {/* ← aquí agregas el botón de volver */}
            <div className="mt-4">
              <button
                onClick={() => navigate('/')}
                className="mx-auto flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-blue-500"
              >
                Volver al inicio
              </button>
            </div>
      </div>
    </div>
  );
}