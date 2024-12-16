import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from "../Config/axiosConfig"; // Importa l'istanza configurata
import { useParams } from 'react-router-dom';
import './ModificaDatiPersonali.css';

const EditUserProfile = () => {
  const { register, handleSubmit, reset } = useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useParams("id");

  const token = localStorage.getItem('token'); // Recupera il token JWT
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log(userId);
        const response = await axiosInstance.get(`api/users/${userId.id}`, config); // Usa axiosInstance
        
        // Rimuovi la password dai dati da precompilare
        const { password, ...userData } = response.data;
        
        setUser(userData);
        reset(userData); // Popola il form senza la password
      } catch (err) {
        setError(err.response?.data?.message || 'Errore nel caricamento dei dati utente.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [userId, reset]);
  

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null);

      // Filtra solo i campi modificati
      const updatedData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== "" && value !== user[key])
      );

      if (Object.keys(updatedData).length === 0) {
        alert('Nessun campo modificato.');
        return;
      }

      const response = await axiosInstance.put(`api/users/updateUser/${userId.id}`, updatedData, config); // Usa axiosInstance
      setUser(response.data);
      alert('Profilo aggiornato con successo!');
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante l\'aggiornamento del profilo.');
    }
  };

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
<div className="profile-container">
    <h1 className="profile-header">Modifica Profilo</h1>
    <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
      <div>
        <label>Nome:</label>
        <input
          type="text"
          {...register('nome')} // Cambiato in 'nome'
          placeholder="Inserisci il tuo nome"
        />
      </div>

      <div>
        <label>Cognome:</label>
        <input
          type="text"
          {...register('cognome')} // Cambiato in 'cognome'
          placeholder="Inserisci il tuo cognome"
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          {...register('email')}
          placeholder="Inserisci la tua email"
        />
      </div>

      <div>
        <label>Nuova Password:</label>
        <input
          type="password"
          {...register('password')}
          placeholder="Inserisci una nuova password"
        />
      </div>


      {error && <p className="error-message">{error}</p>}

      <div>
        <button type="submit">Salva Modifiche</button>
      </div>
    </form>
  </div>
  );
};

export default EditUserProfile;